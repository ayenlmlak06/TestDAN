using System.ComponentModel.DataAnnotations;

namespace Model.RequestModel.Common
{
    public class LoginRequest
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }

    public class RefreshTokenRequest
    {
        [Required]
        public string RefreshToken { get; set; }
    }

    public class SendOTPLoginRequest
    {
        [Required]
        public string UserPhone { get; set; }
    }

    public class LoginByOTPRequest : SendOTPLoginRequest
    {
        [Required]
        public string OTP { get; set; }
    }

    public class LoginByQrCodeRequest
    {
        [Required]
        public string QrCode { get; set; }
    }

    public class ClearBlackListSmsRequest
    {
        public string? UserPhone { get; set; }
    }
}
