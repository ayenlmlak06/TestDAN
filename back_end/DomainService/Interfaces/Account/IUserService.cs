using Model.RequestModel.User;

namespace DomainService.Interfaces.Account
{
    public interface IUserService
    {
        Task<object> GetInfoMine(Guid currentUserId, string currentUserName);
        Task<object> Update(Guid currentUserId, string currentUserName, UserUpdateRequest req);
    }
}
