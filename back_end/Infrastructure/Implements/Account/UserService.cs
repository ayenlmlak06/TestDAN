using Common.Authorization;
using Common.Authorization.Utils;
using Common.Constant;
using Common.UnitOfWork.UnitOfWorkPattern;
using Common.Utils;
using DomainService.Interfaces.Account;
using DomainService.Interfaces.File;
using Entity.Entities.Account;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Model.RequestModel.User;
using Model.ResponseModel.User;

namespace Infrastructure.Implements.Account
{
    public class UserService(
        IUnitOfWork unitOfWork,
        IMemoryCache memoryCache,
        IFileService _fileService) : BaseService(unitOfWork,
            memoryCache),
        IUserService
    {
        public async Task<object> GetInfoMine(Guid currentUserId, string currentUserName)
        {
            var infoUser = await _unitOfWork.Repository<User>().Where(u => u.Id == currentUserId).Select(
                u => new UserInfoResponse()
                {
                    Id = u.Id,
                    UserName = u.UserName,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    Avatar = u.Avatar,
                }).AsNoTracking().FirstOrDefaultAsync()
                ?? throw new AppException(string.Format(CommonMessage.Message_DataNotFound, "User"));

            return Utils.CreateResponseModel(infoUser);
        }

        public async Task<object> Update(Guid currentUserId, string currentUserName, UserUpdateRequest req)
        {
            var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(u => u.Id == currentUserId)
                       ?? throw new AppException(string.Format(CommonMessage.Message_DataNotFound, "User"));

            var isExistUserName = await _unitOfWork.Repository<User>().AnyAsync(u => u.UserName.ToLower() ==
                req.UserName.ToLower() && u.Id != currentUserId);
            if (isExistUserName)
                throw new KeyExistsException($"Tên người dùng {req.UserName} đã tồn tại.");

            if (req.Avatar != null)
            {
                var avatarUrl = await _fileService.UploadFileToAzureAsync(UploadFolder.Avatar, [req.Avatar]);
                user.Avatar = avatarUrl.First();
            }

            user.UserName = req.UserName;
            user.PhoneNumber = req.PhoneNumber;

            _unitOfWork.Repository<User>().Update(user);
            var res = await _unitOfWork.SaveChangesAsync();

            return Utils.CreateResponseModel(res > 0);
        }
    }
}
