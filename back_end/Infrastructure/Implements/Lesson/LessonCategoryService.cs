using Common.Authorization.Utils;
using Common.Constant;
using Common.UnitOfWork.UnitOfWorkPattern;
using Common.Utils;
using DomainService.Interfaces.File;
using DomainService.Interfaces.Lesson;
using Entity.Entities.Lesson;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Model.RequestModel.Lesson;
using Model.ResponseModel.Lesson;

namespace Infrastructure.Implements.Lesson
{
    public class LessonCategoryService(IUnitOfWork unitOfWork, IMemoryCache memoryCache, IFileService _fileService)
        : BaseService(unitOfWork, memoryCache), ILessonCategoryService
    {
        public async Task<object> GetAllAsync()
        {
            var lessonCategories = await _unitOfWork.Repository<LessonCategory>()
                .Where(c => c.IsDeleted != true)
                .OrderBy(c => c.LessonCategoryEnum)
                .Select(c => new LessonCategoryResponse
                {
                    Id = c.Id,
                    Name = c.Name,
                    Thumbnail = c.Thumbnail
                })
                .ToListAsync();

            return Utils.CreateResponseModel(lessonCategories, lessonCategories.Count);
        }

        public async Task<object> GetByIdAsync(Guid id)
        {
            var lessonCategory = await _unitOfWork.Repository<LessonCategory>()
                .Where(c => c.Id == id && c.IsDeleted != true)
                .Select(c => new LessonCategoryResponse
                {
                    Id = c.Id,
                    Name = c.Name,
                    Thumbnail = c.Thumbnail
                }).FirstOrDefaultAsync()
                ?? throw new KeyNotFoundException(string.Format(CommonMessage.Message_DataNotFound, "Lesson Category"));

            return Utils.CreateResponseModel(lessonCategory);
        }

        public async Task<object> CreateAsync(Guid currentUserId, string userName, LessonCategoryRequest req)
        {


            if (await CheckExistNameAsync(req.Name))
                throw new KeyExistsException(string.Format(CommonMessage.Message_Exists, "Lesson Category"));

            var thumbnailUrl = await _fileService.UploadFileToAzureAsync(UploadFolder.LessonCategory, [req.Thumbnail!]);
            var lessonCategory = new LessonCategory
            {
                Name = req.Name,
                Thumbnail = thumbnailUrl.First(),
            };

            _unitOfWork.Repository<LessonCategory>().Add(lessonCategory);
            var res = await _unitOfWork.SaveChangesAsync();

            return Utils.CreateResponseModel(res > 0);
        }

        public async Task<object> UpdateAsync(Guid currentUserId, string userName, Guid id, LessonCategoryUpdateRequest req)
        {
            var lessonCategory = await _unitOfWork.Repository<LessonCategory>().FirstOrDefaultAsync(c => c.IsDeleted != true && c.Id == id)
                ?? throw new KeyNotFoundException(string.Format(CommonMessage.Message_DataNotFound, "Lesson Category"));

            if (await CheckExistNameAsync(req.Name, true, id))
                throw new KeyExistsException(string.Format(CommonMessage.Message_Exists, "Lesson Category"));

            if (req.Thumbnail != null)
            {
                var thumbnailUrl = await _fileService.UploadFileToAzureAsync(UploadFolder.LessonCategory, [req.Thumbnail!]);
                lessonCategory.Thumbnail = thumbnailUrl.First();
            }

            lessonCategory.Name = req.Name;
            lessonCategory.UpdatedById = currentUserId;
            lessonCategory.UpdatedDate = DateTime.Now;
            lessonCategory.Updater = userName;

            _unitOfWork.Repository<LessonCategory>().Update(lessonCategory);
            var res = await _unitOfWork.SaveChangesAsync();

            return Utils.CreateResponseModel(res > 0);
        }

        public async Task<object> DeleteAsync(Guid currentUserId, string userName, Guid id)
        {
            var lessonCategory = await _unitOfWork.Repository<LessonCategory>().FirstOrDefaultAsync(c => c.IsDeleted != true && c.Id == id)
                ?? throw new KeyNotFoundException(string.Format(CommonMessage.Message_DataNotFound, "Lesson Category"));

            lessonCategory.IsDeleted = true;
            lessonCategory.DeletedById = currentUserId;
            lessonCategory.DeletedDate = DateTime.Now;

            _unitOfWork.Repository<LessonCategory>().Update(lessonCategory);
            var res = await _unitOfWork.SaveChangesAsync();

            return Utils.CreateResponseModel(res > 0);
        }

        #region Private methods

        private Task<bool> CheckExistNameAsync(string name, bool isUpdate = false, Guid id = default)
        {
            return _unitOfWork.Repository<LessonCategory>()
                .AnyAsync(c => (c.Name).ToLower()
                               .Equals((name.ToLower())) &&
                               c.IsDeleted != true && (!isUpdate || c.Id == id));
        }

        #endregion
    }
}
