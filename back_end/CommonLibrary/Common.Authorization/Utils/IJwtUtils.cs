using Entity.Entities.Account;
using Model.ResponseModel.Common;

namespace Common.Authorization.Utils;

public interface IJwtUtils
{
    string GenerateToken(Guid userId, string? fullName, string userName, string UDID);
    Guid? ValidateToken(string token);
    Task<User?> ValidateTokenMicrosoft(string? token);
    RfTokenResponse GenerateRefreshToken(Guid userId, string? fullName, string userName, string UDID, string skey, string Issuer, string Audience, string ipAddress);
}