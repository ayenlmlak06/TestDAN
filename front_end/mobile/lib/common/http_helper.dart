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

  static Future<http.Response> get(String url, Map<String, String>? headers,
      Map<String, String>? queryParameters) async {
    try {
      final accessToken = await storage.read(key: 'accessToken') ??
          "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoibnBwIiwiSWQiOiJiYzViOTA4OC04YWMwLTQwNjEtOTkzZi1iMzgyMmE3ODVjMzciLCJEZXZpY2VJZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsInN1YiI6Im5wcCIsIm5hbWUiOiJucHAiLCJlbWFpbCI6Im5wcEB2aWV0bmFtYWlybGluZXMuY29tIiwianRpIjoiMWY4MGE1MWItZmVmNi00ODkwLTljYzctNDQzOWNjNmY0N2MzIiwibmJmIjoxNzM2OTI1NjI4LCJleHAiOjE3MzgxMzUyMjgsImlhdCI6MTczNjkyNTYyOCwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzA3MC8iLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo3MDcwLyJ9.5VAGECc4HiYuPeVrD5UO7rCw6FM4JGyEtCKjqu9TLbL4absrlZTB6lIKNuAlag2OSStSaNn1r5MV6_J2aVFhVg";
      headers = HttpHelper()._addAuthorizationHeader(headers, accessToken);
      final uri =
          Uri.parse('$apiUrl/$url').replace(queryParameters: queryParameters);
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
