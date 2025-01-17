using Common.Authorization;
using Common.UnitOfWork.UnitOfWorkPattern;
using Common.Utils;
using DomainService.Interfaces.File;
using DomainService.Interfaces.Lesson;
using Entity.Entities.Lesson;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Model.RequestModel.Lesson;

namespace Infrastructure.Implements.Lesson
{
    public class LessonService(IUnitOfWork unitOfWork, IMemoryCache memoryCache, IFileService _fileService)
        : BaseService(unitOfWork, memoryCache), ILessonService
    {
        public async Task<object> GetByLessonCategory(Guid categoryId, int pageIndex, int pageSize, string? keyword, bool isOrderByView)
        {
            if (categoryId == Guid.Empty && !isOrderByView) throw new AppException("Loại bài học không hợp lệ.");

            keyword = keyword?.ToLower().Trim();
            var query = _unitOfWork.Repository<Entity.Entities.Lesson.Lesson>()
                .Include(l => l.LessonCategory)
                .Where(l => !l.IsDeleted && (categoryId == Guid.Empty || l.LessonCategoryId == categoryId) &&
                            (string.IsNullOrWhiteSpace(keyword) || l.Title.ToLower().Contains(keyword)));

            if (isOrderByView)
                query = query.OrderByDescending(l => l.TotalView);

            var data = await query.Skip((pageIndex - 1) * pageSize).Take(pageSize).Select(d => new
            {
                Id = d.Id,
                Title = d.Title,
                TotalQuestion = d.TotalQuestion,
                TotalView = d.TotalView,
                LessonCategoryName = d.LessonCategory.Name,
                Thumbnail = d.Thumbnail,
            }).ToListAsync();

            return Utils.CreateResponseModel(data, await query.CountAsync());
        }

        public async Task<object> GetById(Guid id)
        {
            var lesson = await _unitOfWork.Repository<Entity.Entities.Lesson.Lesson>()
                .Include(l => l.LessonCategory).IgnoreAutoIncludes()
                .Include(l => l.Vocabularies)
                .Include(l => l.Grammars)
                .Include(l => l.Questions)
                .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(l => !l.IsDeleted && l.Id == id)
                ?? throw new AppException("Không tìm thấy bài học.");

            return Utils.CreateResponseModel(lesson);
        }

        public async Task<object> Create(Guid currentUserId, string currentUserName, LessonRequest req)
        {
            // Validate lesson category
            var category = await _unitOfWork.Repository<LessonCategory>()
                .FirstOrDefaultAsync(c => !c.IsDeleted && c.Id == req.LessonCategoryId);
            var error = ValidateLessonRequestAsync(category, req);
            if (!string.IsNullOrEmpty(error))
            {
                return error;
            }

            // Create lesson entity
            var lesson = new Entity.Entities.Lesson.Lesson
            {
                Title = req.Title,
                Thumbnail = req.Thumbnail,
                TotalQuestion = req.Questions.Count,
                LessonCategoryId = category!.Id,
                LessonCategory = category
            };

            // Create vocabularies
            if (req.Vocabularies.Any())
            {
                lesson.Vocabularies = req.Vocabularies.Select(v => new Vocabulary
                {
                    Word = v.Word,
                    Pronunciation = v.Pronunciation,
                    Meaning = v.Meaning,
                    Example = v.Example,
                    Lesson = lesson,
                    VocabularyMedias = v.Medias?.Select(m => new VocabularyMedia
                    {
                        Url = m
                    }).ToList() ?? []
                }).ToList();
            }

            if (req.Grammars.Any())
            {
                lesson.Grammars = req.Grammars.Select(g => new Grammar
                {
                    Content = g.Content,
                    Lesson = lesson,
                    Note = g.Note
                }).ToList();
            }

            if (req.Questions.Any())
            {
                lesson.Questions = req.Questions.Select(q => new Question
                {
                    Content = q.Content,
                    Lesson = lesson,
                    Answers = q.Answers.Select(a => new Answer
                    {
                        Content = a.Content,
                        IsCorrect = a.IsCorrect,
                    }).ToList()
                }).ToList();
            }

            await _unitOfWork.Repository<Entity.Entities.Lesson.Lesson>().AddAsync(lesson);

            var saveResult = await _unitOfWork.SaveChangesAsync();
            return Utils.CreateResponseModel(saveResult > 0);
        }

        public async Task<object> Update(Guid currentUserId, string currentUserName, Guid id, LessonUpdateRequest req)
        {
            var lesson = await _unitOfWork.Repository<Entity.Entities.Lesson.Lesson>()
                .Include(l => l.Vocabularies)
                .ThenInclude(v => v.VocabularyMedias)
                .Include(l => l.Grammars)
                .Include(l => l.Questions)
                .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(l => !l.IsDeleted && l.Id == id)
                ?? throw new AppException("Không tìm thấy bài học.");

            //add new data to lesson
            lesson.Title = req.Title;
            lesson.TotalQuestion = req.Questions.Count;
            lesson.Thumbnail = req.Thumbnail ?? lesson.Thumbnail;

            var newVocabularies = new List<Vocabulary>();
            var newGrammars = new List<Grammar>();
            var newQuestions = new List<Question>();
            var newVocabularyMedias = new List<VocabularyMedia>();
            //update vocabularies
            if (req.Vocabularies.Any())
            {
                var commonVocabularies = lesson.Vocabularies.Where(v => req.Vocabularies.Any(r => r.Id == v.Id)).ToList();
                var uniqueVocabularies = req.Vocabularies.Where(r => lesson.Vocabularies.All(v => v.Id != r.Id)).ToList();

                //update common vocabularies
                commonVocabularies.ForEach(v =>
                {
                    var reqVocabulary = req.Vocabularies.FirstOrDefault(r => r.Id == v.Id);
                    if (reqVocabulary != null)
                    {
                        v.Word = reqVocabulary.Word;
                        v.Pronunciation = reqVocabulary.Pronunciation;
                        v.Meaning = reqVocabulary.Meaning;
                        v.Example = reqVocabulary.Example;
                        v.UpdatedDate = DateTime.Now;
                        v.UpdatedById = currentUserId;
                        var commonMedias = v.VocabularyMedias?.Where(m => reqVocabulary.Medias != null && reqVocabulary.Medias.Any(r => r == m.Url)).ToList();
                        var uniqueMedias = reqVocabulary.Medias?.Where(r => v.VocabularyMedias != null && v.VocabularyMedias.All(m => m.Url != r)).ToList();
                        commonMedias?.ForEach(m =>
                        {
                            if (reqVocabulary.Medias != null)
                            {
                                var reqMedia = reqVocabulary.Medias.FirstOrDefault(r => r == m.Url);
                                if (reqMedia != null)
                                {
                                    m.Url = reqMedia;
                                    m.UpdatedDate = DateTime.Now;
                                    m.UpdatedById = currentUserId;
                                }
                            }
                        });
                        uniqueMedias?.ForEach(m =>
                        {
                            newVocabularyMedias.Add(new VocabularyMedia
                            {
                                Url = m,
                                Vocabulary = v
                            });
                        });
                    }
                });

                uniqueVocabularies.ForEach(v =>
                {
                    newVocabularies.Add(new Vocabulary
                    {
                        Word = v.Word,
                        Pronunciation = v.Pronunciation,
                        Meaning = v.Meaning,
                        Example = v.Example,
                        Lesson = lesson,
                        VocabularyMedias = v.Medias?.Select(m => new VocabularyMedia
                        {
                            Url = m
                        }).ToList() ?? []
                    });
                });
            }

            //update grammars
            if (req.Grammars.Any())
            {
                var commonGrammars = lesson.Grammars.Where(v => req.Grammars.Any(r => r.Id == v.Id)).ToList();
                var uniqueGrammars = req.Grammars.Where(r => lesson.Grammars.All(v => v.Id != r.Id)).ToList();

                foreach (var grammar in commonGrammars)
                {
                    var reqGrammar = req.Grammars.FirstOrDefault(r => r.Id == grammar.Id);
                    if (reqGrammar != null)
                    {
                        grammar.Content = reqGrammar.Content;
                        grammar.UpdatedDate = DateTime.Now;
                    }
                }

                foreach (var item in uniqueGrammars)
                {
                    newGrammars.Add(new Grammar
                    {
                        Content = item.Content,
                        Lesson = lesson,
                        LessonId = lesson.Id
                    });
                }
            }

            //update questions
            if (req.Questions.Any())
            {
                var commonQuestions = lesson.Questions.Where(v => req.Questions.Any(r => r.Id == v.Id)).ToList();
                var uniqueQuestions = req.Questions.Where(r => lesson.Questions.All(v => v.Id != r.Id)).ToList();

                foreach (var question in commonQuestions)
                {
                    var reqQuestion = req.Questions.FirstOrDefault(r => r.Id == question.Id);
                    if (reqQuestion != null)
                    {
                        question.Content = reqQuestion.Content;
                        question.UpdatedDate = DateTime.Now;
                        question.UpdatedById = currentUserId;
                        var commonAnswers = question.Answers.Where(m => reqQuestion.Answers.Any(r => r.Id == m.Id)).ToList();
                        var uniqueAnswers = reqQuestion.Answers.Where(r => question.Answers.All(m => m.Id != r.Id)).ToList();
                        commonAnswers.ForEach(m =>
                        {
                            var reqAnswer = reqQuestion.Answers.FirstOrDefault(r => r.Id == m.Id);
                            if (reqAnswer != null)
                            {
                                m.Content = reqAnswer.Content;
                                m.IsCorrect = reqAnswer.IsCorrect;
                                m.UpdatedDate = DateTime.Now;
                                m.UpdatedById = currentUserId;
                            }
                        });
                        uniqueAnswers.ForEach(m =>
                        {
                            question.Answers.Add(new Answer
                            {
                                Content = m.Content,
                                IsCorrect = m.IsCorrect,
                                Question = question
                            });
                        });
                    }
                }

                uniqueQuestions.ForEach(v =>
                {
                    newQuestions.Add(new Question
                    {
                        Content = v.Content,
                        Lesson = lesson,
                        Answers = v.Answers.Select(a => new Answer
                        {
                            Content = a.Content,
                            IsCorrect = a.IsCorrect,
                        }).ToList()
                    });
                });
            }

            await _unitOfWork.Repository<Vocabulary>().AddRangeAsync(newVocabularies);
            await _unitOfWork.Repository<Grammar>().AddRangeAsync(newGrammars);
            await _unitOfWork.Repository<Question>().AddRangeAsync(newQuestions);
            await _unitOfWork.Repository<VocabularyMedia>().AddRangeAsync(newVocabularyMedias);
            _unitOfWork.Repository<Entity.Entities.Lesson.Lesson>().Update(lesson);
            return Utils.CreateResponseModel(await _unitOfWork.SaveChangesAsync() > 0);
        }

        public async Task<object> Delete(Guid currentUserId, string currentUserName, Guid id)
        {
            var lesson = await _unitOfWork.Repository<Entity.Entities.Lesson.Lesson>().FindAsync(id)
                ?? throw new AppException("Không tìm thấy bài học.");

            lesson.IsDeleted = true;
            lesson.DeletedById = currentUserId;
            lesson.DeletedDate = DateTime.Now;

            _unitOfWork.Repository<Entity.Entities.Lesson.Lesson>().Update(lesson);
            return Utils.CreateResponseModel(await _unitOfWork.SaveChangesAsync() > 0);
        }

        #region Private methods

        private string ValidateLessonRequestAsync(LessonCategory? category, LessonRequest req)
        {
            var error = string.Empty;


            if (category == null)
                return "Không tồn tại loại bài học, vui lòng thử lại.";

            switch (category.LessonCategoryEnum)
            {
                case LessonCategoryEnum.Vocabulary:
                    if (req.Grammars.Any())
                        error = $"Loại {nameof(LessonCategoryEnum.Vocabulary)} không thể có dữ liệu {nameof(LessonCategoryEnum.Grammar)}";
                    break;

                case LessonCategoryEnum.Grammar:
                    if (req.Vocabularies.Any())
                        error = $"Loại {nameof(LessonCategoryEnum.Grammar)} không thể có dữ liệu {nameof(LessonCategoryEnum.Vocabulary)}";
                    break;

                case LessonCategoryEnum.Dictionary:
                    error = "Chưa thể tạo bài học cho từ điển, vui lòng liên hệ với nhà phát triển.";
                    break;

                default:
                    break;
            }

            return error;
        }


        #endregion
    }
}
