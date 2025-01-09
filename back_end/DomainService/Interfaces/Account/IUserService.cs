﻿using Model.RequestModel.Auth;

namespace DomainService.Interfaces.Account
{
    public interface IUserService
    {
        Task<object> GetList(Guid currentUserId, string currentUserName, string keyword, int pageIndex, int pageSize);
        Task<object> GetDetail(Guid currentUserId, string currentUserName, Guid id);
        Task<object> Create(Guid currentUserId, string currentUserName, AccountRequest req);
        Task<object> Update(Guid currentUserId, string currentUserName, Guid accountId, AccountRequest req);
        Task<object> Delete(Guid currentUserId, string currentUserName, Guid id);
        Task<object> GetInfoMine(Guid currentUserId, string currentUserName);
    }
}
