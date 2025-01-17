using Model.RequestModel.Lesson;

namespace DomainService.Interfaces.Lesson
{
    public interface ILessonCategoryService
    {
        Task<object> GetAllAsync();
        Task<object> GetByIdAsync(Guid id);
        Task<object> CreateAsync(Guid currentUserId, string userName, LessonCategoryRequest req);
        Task<object> UpdateAsync(Guid currentUserId, string userName, Guid id, LessonCategoryUpdateRequest req);
        Task<object> DeleteAsync(Guid currentUserId, string userName, Guid id);
    }
}
