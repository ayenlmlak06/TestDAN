using Asp.Versioning;
using Controllers;
using DomainService.Interfaces.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Model.RequestModel.Common;

namespace API_LES_APP.Controllers.Version1.Account
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class UserController(IHttpContextAccessor httpContextAccessor, IAuthService _authService, IUserService _userService) : BaseController(httpContextAccessor)
    {

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<object> SignIn(LoginRequest req)
        {
            var userDevice = GetRequestDeviceInfo(Request);

            var res = await _authService.Login(req, userDevice);
            return Ok(res);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<object> Register(LoginRequest req)
        {
            var res = await _authService.Register(req);
            return Ok(res);
        }

        [AllowAnonymous]
        [HttpPost("login-otp")]
        public async Task<object> LoginByOTP(LoginByOTPRequest req)
        {
            var userDevice = GetRequestDeviceInfo(Request);
            var deviceInfo = new DeviceInfoRequest
            {
                UDID = userDevice.DeviceUUID ?? "",
                DeviceName = userDevice.DeviceName,
                OSName = userDevice.DeviceOS,
                OSVersion = userDevice.DevicePlatform
            };
            var res = await _authService.LoginByOTP(req, deviceInfo, ipAddress);
            return Ok(res);
        }

        [AllowAnonymous]
        [HttpPost("refresh-access-token")]
        public async Task<object> RefreshAccessToken(RefreshTokenRequest req)
        {
            var userDevice = GetRequestDeviceInfo(Request);
            var deviceInfo = new DeviceInfoRequest
            {
                UDID = userDevice.DeviceUUID ?? "",
                DeviceName = userDevice.DeviceName,
                OSName = userDevice.DeviceOS,
                OSVersion = userDevice.DevicePlatform
            };
            var res = await _authService.GetNewTokenByRefreshToken(req, deviceInfo, ipAddress);
            return Ok(res);
        }

        [AllowAnonymous]
        [HttpPost("login-google")]
        public async Task<object> LoginGoogle([FromBody] string accessToken)
        {
            var res = await _authService.GetInfoGoogle(accessToken);
            return Ok(res);
        }

        /*[AllowAnonymous]
        [HttpGet("signin-google")]
        public IActionResult SignInGoogle()
        {
            var properties = new AuthenticationProperties
            {
                RedirectUri = Url.Action("GoogleResponse")
            };
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        [AllowAnonymous]
        [HttpGet("google-response")]
        public async Task<IActionResult> GoogleResponseAsync()
        {
            var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            if (!result.Succeeded)
            {
                return BadRequest();
            }

            var accessToken = result.Properties.GetTokenValue("access_token");
            var res = await _loginService.GetInfoGoogle(accessToken ?? "");
            return Ok(res);
        }*/

        #region CRUD User

        [HttpGet("get-users")]
        public async Task<object> GetUsers(string keyword = "", int pageIndex = 1, int pageSize = 50)
        {
            var res = await _userService.GetList(currentUserId, username, keyword, pageIndex, pageSize);
            return Ok(res);
        }

        [HttpGet("get-detail/{id}")]
        public async Task<object> GetUserDetail(Guid id)
        {
            var res = await _userService.GetDetail(currentUserId, username, id);
            return Ok(res);
        }

        [HttpGet("get-info-mine")]
        public async Task<object> GetInfoMine()
        {
            var res = await _userService.GetInfoMine(currentUserId, username);
            return Ok(res);
        }

        #endregion
    }
}
