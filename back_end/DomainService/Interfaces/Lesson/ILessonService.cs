using Model.RequestModel.Lesson;

namespace DomainService.Interfaces.Lesson
{
    public interface ILessonService
    {
        Task<object> GetByLessonCategory(Guid categoryId, int pageIndex, int pageSize, string? keyword, bool isOrderByView);
        Task<object> GetById(Guid id);
        Task<object> Create(Guid currentUserId, string currentUserName, LessonRequest req);
        Task<object> Update(Guid currentUserId, string currentUserName, Guid id, LessonUpdateRequest req);
        Task<object> Delete(Guid currentUserId, string currentUserName, Guid id);
    }
}
