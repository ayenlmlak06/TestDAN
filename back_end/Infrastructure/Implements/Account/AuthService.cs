using Common.Authorization;
using Common.Authorization.Utils;
using Common.Constant;
using Common.Enum;
using Common.Settings;
using Common.UnitOfWork.UnitOfWorkPattern;
using Common.Utils;
using DomainService.Interfaces.Account;
using Entity.Entities.Account;
using Infrastructure.Implements.PasswordHelper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Model.RequestModel.Common;
using Model.ResponseModel.Common;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using Task = System.Threading.Tasks.Task;

namespace Infrastructure.Implements.Account
{
    public class AuthService(
        IPasswordHelper passwordHasher,
        IUnitOfWork unitOfWork,
        IMemoryCache memoryCache,
        IJwtUtils _jwtUtils,
        IOptions<StrJWT> strJwt,
        IOptions<AppSettings> appSettings) : BaseService(unitOfWork,
            memoryCache),
        IAuthService
    {
        private readonly StrJWT _strJwt = strJwt.Value;
        private readonly AppSettings _appSettings = appSettings.Value;

        public async Task<object> Login(LoginRequest req, UserDeviceRequest userDevice)
        {
            var account = await _unitOfWork.Repository<User>()
                                           .FirstOrDefaultAsync(s => ((s.Email ?? "").Equals(req.Email)) && s.IsDeleted != true)
                                           ?? throw new AppException("Email không chính xác, hoặc tài khoản chưa tồn tại!");

            if (!passwordHasher.VerifyPassword(account, account.Password, req.Password))
                throw new AppException("Mật khẩu không chính xác!");

            if (RegexUtilities.IsValidEmail(req.Email))
            {
                var deviceExist = await _unitOfWork.Repository<Device>()
                                                   .FirstOrDefaultAsync(s => s.User.Id == account.Id && s.IsActive == true &&
                                                                        s.DeviceId == userDevice.DeviceUUID);

                var accessToken = _jwtUtils.GenerateToken(account.Id, account.UserName ?? "", userDevice.DeviceUUID, account.UserName);
                var refreshToken = _jwtUtils.GenerateRefreshToken(account.Id, account.UserName ?? "", account.UserName, userDevice.DeviceUUID,
                    _strJwt.Key, _strJwt.Issuer, _strJwt.Audience, "");

                #region check device

                var deviceInfo = new DeviceInfoRequest
                {
                    UDID = userDevice.DeviceUUID ?? "",
                    DeviceName = userDevice.DeviceName,
                    OSName = userDevice.DeviceOS,
                    OSVersion = userDevice.DevicePlatform
                };

                await CheckDevice(account.Id, refreshToken, accessToken, deviceInfo);

                #endregion check device

                var loginResponse = new LoginResponse
                {
                    UserId = account.Id,
                    UserName = account.UserName
                };
                loginResponse.SetToken(accessToken);
                loginResponse.SetRefreshToken(refreshToken.Token);

                return Utils.CreateResponseModel(loginResponse);
            }

            throw new AppException("Email không chính xác, hoặc tài khoản chưa tồn tại!");
        }

        public async Task<object> Register(LoginRequest req)
        {
            var existEmail = await _unitOfWork.Repository<User>()
                                              .AnyAsync(s => (s.Email ?? "").Equals(req.Email) && s.IsDeleted != true);

            if (existEmail) throw new AppException("Email đã tồn tại!");

            var user = new User(req.Email)
            {
                Email = req.Email,
                Password = "",
                LoginType = LoginType.System
            };

            user.Password = passwordHasher.HashPassword(user, req.Password);
            user.CreatedById = user.Id;

            _unitOfWork.Repository<User>().Add(user);
            var res = await _unitOfWork.SaveChangesAsync();

            return Utils.CreateResponseModel(res > 0);
        }

        public async Task<LoginResponse> GetNewTokenByRefreshToken(RefreshTokenRequest model, DeviceInfoRequest deviceInfo, string ipAddress)
        {
            var user = await _unitOfWork.Repository<User>()
                           .Where(a => a.IsDeleted != true)
                           .Include(a => a.Devices)
                           .Select(a => new
                           {
                               Account = a,
                               Device = a.Devices.FirstOrDefault(d => d.RefreshToken == model.RefreshToken && d.DeviceId == deviceInfo.UDID)
                           })
                           .FirstOrDefaultAsync()
                       ?? throw new KeyNotFoundException(StatusMessage.DataNotFound);

            var device = user.Device;

            // replace old refresh token with a new one and save
            string? skey = _strJwt.Key;
            string? issuer = _strJwt.Issuer;
            string? audience = _strJwt.Audience;
            var newRefreshToken = _jwtUtils.GenerateRefreshToken(user.Account.Id, user.Account.UserName, user.Account.UserName, deviceInfo.UDID, skey, issuer, audience, ipAddress);
            device.RefreshToken = newRefreshToken.Token;
            _unitOfWork.Repository<Device>().Update(device);
            _unitOfWork.Repository<User>().Update(user.Account);
            await _unitOfWork.SaveChangesAsync();

            var jwtToken = _jwtUtils.GenerateToken(user.Account.Id, user.Account.UserName, user.Account.UserName, deviceInfo.UDID);
            var res = new LoginResponse();
            /*res.SetToken(jwtToken);
            res.SetRefreshToken(newRefreshToken.Token);*/

            return res;
        }

        public bool RevokeToken(RefreshTokenRequest model, DeviceInfoRequest deviceInfo, string ipAddress)
        {
            /*var user = _unitOfWork.Repository<ViagsUser>().Include(s => s.Devices).SingleOrDefault(
                s => s.IsDelete != true && s.Devices.Any(t => t.DeviceId == deviceInfo.DeviceId && (t.RefreshToken == model.RefreshToken)));

            // return false if no user found with token
            if (user == null) throw new KeyNotFoundException("Token not found");

            var device = user.Devices.Single(x => x.DeviceId == deviceInfo.DeviceId && x.RefreshToken == model.RefreshToken);

            // return false if token is not active
            if (device.RfTokenExpiryTime <= DateTime.UtcNow || device.RfTokenRevokedTime != null ||
                device.RfTokenRevokedByIp != null || device.RfTokenCreatedByIp != ipAddress)
                throw new AppException("Token already expires");

            // revoke token and save
            device.RfTokenRevokedTime = DateTime.UtcNow;
            device.RfTokenRevokedByIp = ipAddress;
            _unitOfWork.Repository<Entity.Entities.Device>().Update(device);
            _unitOfWork.Repository<ViagsUser>().Update(user);
            _unitOfWork.SaveChangesAsync();
            _unitOfWork.Dispose();*/

            return true;
        }

        public bool SendOTPLoginToPhone(SendOTPLoginRequest model, DeviceInfoRequest deviceInfo)
        {
            if (!RegexUtilities.IsValidPhone(model.UserPhone)) throw new AppException("Phone is wrong!");
            var otpCode = Utils.GenerateOneTimeOTP();
            var modelOtp = new ModelOtp
            {
                Code = otpCode,
                UDID = deviceInfo.UDID
            };

            Dictionary<string, int> dataBlackList;
            int numSent = 0;

            if (_memoryCache.TryGetValue(CacheKey.BlackListSms, out dataBlackList))
            {
                if (dataBlackList.TryGetValue(model.UserPhone, out numSent) && numSent >= 3)
                    throw new AppException("Too many sms sent, please try again in 24 hours!");
            }
            else
            {
                dataBlackList = new Dictionary<string, int>();
            }

            var res = SmsUtils.SendOTPToPhone(model.UserPhone, otpCode, _appSettings.SmsToken, _appSettings.SmsServiceUrl);
            if (res)
            {
                numSent += 1;
                dataBlackList[model.UserPhone] = numSent;
                _memoryCache.Set(CacheKey.BlackListSms, dataBlackList, CacheTime.BlackList);
            }

            _memoryCache.Set(model.UserPhone, modelOtp, CacheTime.OTP);
            return res;
        }

        public async Task<LoginResponse> LoginByOTP(LoginByOTPRequest model, DeviceInfoRequest deviceInfo, string ipAddress)
        {
            //Check phone to get user
            var user = _unitOfWork.Repository<User>()
                .FirstOrDefault(s => (s.PhoneNumber ?? "").Equals(model.UserPhone) && s.IsDeleted != true);
            if (user == null) throw new AppException("Phone is not found or not register!");
#if !DEBUG
            //Check otp
            ModelOtp otpSaved;
            if (!_memoryCache.TryGetValue(model.UserPhone, out otpSaved)) throw new AppException("Phone is wrong or OTP was expired, please re-enter the OTP");
            otpSaved.NumCheck += 1;
            if (otpSaved.NumCheck > 3) throw new AppException("OTP has been entered too many times, please re-enter the OTP");
            if (otpSaved.Expire < DateTime.Now) throw new AppException("OTP was expired, please re-enter the OTP");
            if (otpSaved.Code != model.OTP) throw new AppException("OTP is wrong!");
            if (otpSaved.DeviceId != deviceInfo.DeviceId) throw new AppException("Device is wrong!");

#else
            var otpdefault = $"89{DateTime.Now.ToString("yyMM")}";
            if (!model.OTP.Equals(otpdefault))
                throw new AppException("OTP is wrong!");
#endif
            string? skey = _strJwt.Key;
            string? issuer = _strJwt.Issuer;
            string? audience = _strJwt.Audience;
            var refreshToken = _jwtUtils.GenerateRefreshToken(user.Id, user.UserName, user.UserName, deviceInfo.UDID, skey,
                issuer, audience, ipAddress);
            var accessToken = _jwtUtils.GenerateToken(user.Id, user.UserName, deviceInfo.UDID, user.UserName);
            #region check device

            await CheckDevice(user.Id, refreshToken, accessToken, deviceInfo);

            #endregion check device

            var res = new LoginResponse();
            res.SetToken(accessToken);
            res.SetRefreshToken(refreshToken.Token);

            return res;
        }

        public void ClearBlackListSms(ClearBlackListSmsRequest model)
        {
            var keyBlackList = "BlackListSms";
            if (model.UserPhone != null)
            {
                Dictionary<string, int> dataBlackList;
                if (_memoryCache.TryGetValue(keyBlackList, out dataBlackList))
                {
                    dataBlackList.Remove(model.UserPhone);
                }
            }
            else
                _memoryCache.Remove(keyBlackList);
        }

        public async Task<object> GetInfoGoogle(string accessToken)
        {
            using var httpClient = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Get, "https://www.googleapis.com/oauth2/v2/userinfo");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var response = await httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var info = JsonConvert.DeserializeObject<InfoGoogleResponse>(content);

            var userGoogle = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(u =>
                (u.Email ?? "").Equals(info.Email) &&
                u.IsDeleted != true &&
                u.LoginType == LoginType.Google);

            if (userGoogle == null)
            {
                var userExistDiffTypeLogin = await _unitOfWork.Repository<User>().AnyAsync(u =>
                    (u.Email ?? "").Equals(info!.Email ?? "") &&
                    u.IsDeleted != true &&
                    u.LoginType != LoginType.Google);

                if (userExistDiffTypeLogin) throw new AppException("Email đã tồn tại trong hệ thống");

                userGoogle = new User(info.Email)
                {
                    Email = info.Email,
                    Avatar = info.Picture,
                    LoginType = LoginType.Google,
                };

                _unitOfWork.Repository<User>().Add(userGoogle);
                await _unitOfWork.SaveChangesAsync();
            }

            var jwtToken = _jwtUtils.GenerateToken(userGoogle.Id, userGoogle.UserName, Guid.Empty.ToString(), userGoogle.UserName);
            string? skey = _strJwt.Key;
            string? issuer = _strJwt.Issuer;
            string? audience = _strJwt.Audience;
            var refreshToken = _jwtUtils.GenerateRefreshToken(userGoogle.Id, userGoogle.UserName, userGoogle.UserName, Guid.Empty.ToString(), skey,
                issuer, audience, "");

            var retUser = new LoginResponse
            {
                UserId = userGoogle.Id,
                UserName = userGoogle.UserName
            };

            retUser.SetToken(jwtToken);
            retUser.SetRefreshToken(refreshToken.Token);

            return Utils.CreateResponseModel(retUser);
        }

        #region Private Methods

        private async Task CheckDevice(Guid userId, RfTokenResponse refreshToken, string accessToken, DeviceInfoRequest deviceInfo)
        {

            var userAndDevices = await _unitOfWork.Repository<User>().Include(u => u.Devices)
                                                .FirstOrDefaultAsync(s => s.Id == userId && s.IsDeleted != true)
                ?? throw new AppException(string.Format(CommonMessage.Message_DataNotFound, "User"));

            var device = userAndDevices.Devices.FirstOrDefault(d => d.IsActive == true && d.DeviceId == deviceInfo.UDID);

            if (device == null)
            {
                device = new Device
                {
                    DeviceId = deviceInfo.UDID,
                    OSVersion = deviceInfo.OSVersion,
                    OSName = deviceInfo.OSName,
                    DeviceType = deviceInfo.DeviceType,
                    DeviceName = deviceInfo.DeviceName,
                    DeviceDescription = deviceInfo.DeviceDescription,
                    RefreshToken = refreshToken.Token,
                    AccessToken = accessToken,
                    IsActive = true,
                    CreatedDate = DateTime.Now,
                    CreatedById = userId,
                    User = userAndDevices!
                };
                _unitOfWork.Repository<Device>().Add(device);
            }
            else
            {
                device.IsActive = true;
                device.RefreshToken = refreshToken.Token;
                device.AccessToken = accessToken;
                device.IsDeleted = false;
                device.UpdatedDate = DateTime.Now;
                device.UpdatedById = userId;

                _unitOfWork.Repository<Device>().Update(device);
            }

            await _unitOfWork.SaveChangesAsync();
        }

        #endregion Private Methods
    }
}
