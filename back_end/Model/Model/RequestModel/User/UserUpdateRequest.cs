using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace Model.RequestModel.User
{
    public class UserUpdateRequest
    {
        public string UserName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public IFormFile? Avatar { get; set; }
    }

    public class UserUpdateRequestValidator : AbstractValidator<UserUpdateRequest>
    {
        public UserUpdateRequestValidator()
        {
            RuleFor(x => x.UserName).NotEmpty().WithMessage("UserName is required");
        }
    }
}
