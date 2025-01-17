import 'dart:convert';
import 'dart:io';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:les_app/common/cache_key.dart';
import 'package:les_app/common/http_helper.dart';
import 'package:les_app/common/secure_storage_helper.dart';
import 'package:les_app/model/request_model/login_model.dart';
import 'package:les_app/model/response_model/base_response_model.dart';
import 'package:les_app/model/response_model/login_response_model.dart';
import 'package:uuid/uuid.dart';

class AuthService {
  final SecureStorageHelper _storage = SecureStorageHelper();

  Future<BaseResponseModel<LoginResponseModel?>> handleLogin(
      String email, String password) async {
    var body = LoginModel(email: email, password: password).toJson();
    final headers = await buildDeviceInfoHeaders();
    final response = await HttpHelper.post('v1/user/login', body, headers);
    final data = BaseResponseModel<LoginResponseModel?>.fromJson(
      jsonDecode(response.body),
      (json) => LoginResponseModel.fromJson(json as Map<String, dynamic>),
    );
    return data;
  }

  Future<BaseResponseModel<bool>> handleRegister(
      String email, String password) async {
    var body = LoginModel(email: email, password: password).toJson();
    final headers = await buildDeviceInfoHeaders();
    final response = await HttpHelper.post('/v1/user/register', body, headers);
    final data = BaseResponseModel<bool>.fromJson(
      jsonDecode(response.body),
      (json) => json as bool,
    );
    return data;
  }

  Future<void> saveLoginData(LoginResponseModel data) async {
    await Future.wait([
      _storage.saveData(CacheKey.accessToken, data.accessToken),
      _storage.saveData(CacheKey.refreshToken, data.refreshToken),
      _storage.saveData(CacheKey.userId, data.userId),
      _storage.saveData(CacheKey.userName, data.userName)
    ]);
  }

  Future<BaseResponseModel<LoginResponseModel?>> signInWithGoogle(
      String accessToken) async {
    try {
      final headers = await buildDeviceInfoHeaders();
      final response =
          await HttpHelper.post('v1/user/login-google', accessToken, headers);

      final data = BaseResponseModel<LoginResponseModel?>.fromJson(
          json.decode(response.body), (json) {
        return LoginResponseModel.fromJson(json as Map<String, dynamic>);
      });
      return data;
    } on Exception catch (e) {
      await GoogleSignIn().signOut();
      throw Exception('Failed to sign in with Google: $e');
    }
  }

  Future<Map<String, String>> buildDeviceInfoHeaders() async {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'X_DEVICE_UDID': Uuid().v4().toString(),
    };

    // Get info of device
    final deviceInfo = DeviceInfoPlugin();
    if (Platform.isAndroid) {
      AndroidDeviceInfo androidInfo = await deviceInfo.androidInfo;
      //get version of android
      headers['X_DEVICE_OS'] = "Android ${androidInfo.version.release}";
      headers['X_DEVICE_MODEL'] = androidInfo.model;
      headers['X_DEVICE_NAME'] = androidInfo.product;
    } else if (Platform.isIOS) {
      IosDeviceInfo iosInfo = await deviceInfo.iosInfo;
      //get version of ios
      headers['X_DEVICE_OS'] = "iOS ${iosInfo.systemVersion}";
      headers['X_DEVICE_MODEL'] = iosInfo.model;
      headers['X_DEVICE_NAME'] = iosInfo.name;
    }

    return headers;
  }
}
