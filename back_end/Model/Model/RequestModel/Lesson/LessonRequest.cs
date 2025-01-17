using FluentValidation;

namespace Model.RequestModel.Lesson
{
    public class LessonRequest
    {
        public required string Title { get; set; }
        public required string Thumbnail { get; set; }
        public Guid LessonCategoryId { get; set; }
        public List<VocabularyRequest> Vocabularies { get; set; } = [];
        public List<GrammarRequest> Grammars { get; set; } = [];
        public List<QuestionRequest> Questions { get; set; } = [];
    }

    public class LessonRequestValidator : AbstractValidator<LessonRequest>
    {
        public LessonRequestValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty()
                .WithMessage($"{nameof(LessonRequest.Title)} is required.");

            RuleFor(x => x.Thumbnail)
                .NotEmpty()
                .WithMessage($"{nameof(LessonRequest.Thumbnail)} is required.");

            RuleFor(x => x.LessonCategoryId)
                .NotEmpty()
                .WithMessage($"{nameof(LessonRequest.LessonCategoryId)} is required.");

            RuleForEach(x => x.Vocabularies)
                .SetValidator(new VocabularyRequestValidation());

            RuleForEach(x => x.Grammars)
                .SetValidator(new GrammarRequestValidation());

            RuleForEach(x => x.Questions)
                .SetValidator(new QuestionRequestValidation());
        }
    }
}
