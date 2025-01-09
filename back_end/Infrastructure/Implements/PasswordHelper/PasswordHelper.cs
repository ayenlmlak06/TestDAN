using Entity.Entities.Account;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Implements.PasswordHelper
{
    public class PasswordHelper(IPasswordHasher<User> passwordHasher) : IPasswordHelper
    {
        public string HashPassword(User user, string password) => passwordHasher.HashPassword(user, password);

        public bool VerifyPassword(User user, string passwordHash, string password)
        {
            var result = passwordHasher.VerifyHashedPassword(user, passwordHash, password);
            return result == PasswordVerificationResult.Success;
        }
    }
}
