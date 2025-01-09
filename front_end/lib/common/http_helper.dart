import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

class HttpHelper {
  HttpHelper._privateConstructor();

  static final HttpHelper _instance = HttpHelper._privateConstructor();
  static final apiUrl =
      dotenv.env['API_URL'] ?? 'https://les-app-api.azurewebsites.net/api/';
  static final storage = FlutterSecureStorage();

  factory HttpHelper() {
    return _instance;
  }

  Future<String?> _getAccessToken() async {
    return await storage.read(key: 'accessToken');
  }

  Map<String, String> _addAuthorizationHeader(
      Map<String, String>? headers, String? accessToken) {
    headers ??= {};
    if (accessToken != null) {
      headers['Authorization'] = 'Bearer $accessToken';
    }
    return headers;
  }

  Future<http.Response> get({
    required String url,
    Map<String, String>? headers,
    Map<String, String>? queryParameters,
  }) async {
    try {
      final accessToken = await _getAccessToken();
      headers = _addAuthorizationHeader(headers, accessToken);

      final uri = Uri.parse(url).replace(queryParameters: queryParameters);
      final response = await http.get(uri, headers: headers);
      return response;
    } catch (e) {
      throw Exception('Failed to fetch data: $e');
    }
  }

  static Future<http.Response> post(
      String url, dynamic data, Map<String, String>? headers) async {
    try {
      final accessToken = await storage.read(key: 'accessToken');
      headers = HttpHelper()._addAuthorizationHeader(headers, accessToken);

      final response = await http.post(Uri.parse('$apiUrl/$url'),
          body: jsonEncode(data), headers: headers);
      return response;
    } catch (e) {
      throw Exception('Failed to fetch data: $e');
    }
  }

  static Future<http.Response> put(
      String url, dynamic data, Map<String, String>? headers) async {
    try {
      final accessToken = await storage.read(key: 'accessToken');
      headers = HttpHelper()._addAuthorizationHeader(headers, accessToken);

      final response = await http.put(Uri.parse('$apiUrl/$url'),
          body: jsonEncode(data), headers: headers);
      return response;
    } catch (e) {
      throw Exception('Failed to fetch data: $e');
    }
  }

  static Future<http.Response> delete(
      String url, Map<String, String>? headers) async {
    try {
      final accessToken = await storage.read(key: 'accessToken');
      headers = HttpHelper()._addAuthorizationHeader(headers, accessToken);

      final response =
          await http.delete(Uri.parse('$apiUrl/$url'), headers: headers);
      return response;
    } catch (e) {
      throw Exception('Failed to fetch data: $e');
    }
  }

  static Future<http.Response> postFile(String url, Map<String, dynamic> data,
      Map<String, String> headers) async {
    try {
      final request = http.MultipartRequest('POST', Uri.parse('$apiUrl/$url'));
      data.forEach((key, value) {
        if (value is String) {
          request.fields[key] = value;
        } else {
          request.files.add(
              http.MultipartFile.fromBytes(key, value, filename: 'file.jpg'));
        }
      });
      final accessToken = await storage.read(key: 'accessToken');
      headers = HttpHelper()._addAuthorizationHeader(headers, accessToken);

      request.headers.addAll(headers);
      final response = await request.send();
      final responseData = await response.stream.toBytes();
      return http.Response(utf8.decode(responseData), response.statusCode);
    } catch (e) {
      throw Exception('Failed to fetch data: $e');
    }
  }
}
