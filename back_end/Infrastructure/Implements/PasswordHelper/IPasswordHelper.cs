using Entity.Entities.Account;

namespace Infrastructure.Implements.PasswordHelper
{
    public interface IPasswordHelper
    {
        string HashPassword(User user, string password);
        bool VerifyPassword(User user, string hashedPassword, string password);
    }
}
