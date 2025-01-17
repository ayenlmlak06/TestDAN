import 'dart:convert';
import 'package:les_app/common/http_helper.dart';
import 'package:les_app/model/response_model/base_response_model.dart';
import 'package:les_app/model/response_model/lesson_category_response_model.dart';
import 'package:les_app/model/response_model/lesson_detail_response_model.dart';
import 'package:les_app/model/response_model/lesson_response_model.dart';

class HomeService {
  Future<BaseResponseModel<List<LessonCategoryResponseModel>>>
      getHomeData() async {
    final response = await HttpHelper.get('v1/lessoncategories', null, null);
    final data = BaseResponseModel<List<LessonCategoryResponseModel>>.fromJson(
      jsonDecode(response.body),
      (json) {
        final list = json as List;
        return list
            .map((e) => LessonCategoryResponseModel.fromJson(e))
            .toList();
      },
    );

    return data;
  }

  Future<BaseResponseModel<List<LessonResponseModel>>> getHotLesson() async {
    final queryParameters = {
      'pageIndex': '1',
      'pageSize': '10',
      'isOrderByview': 'true'
    };
    final response = await HttpHelper.get('v1/lessons', null, queryParameters);
    final data = BaseResponseModel.fromJson(jsonDecode(response.body), (json) {
      final list = json as List;
      return list.map((l) => LessonResponseModel.fromJson(l)).toList();
    });
    return data;
  }

  Future<BaseResponseModel<List<LessonResponseModel>>> getLessonByCategory(
      String id, int pageIndex, int pageSize, String? keyowrd) async {
    final queryParameters = {
      'categoryId': id,
      'pageIndex': pageIndex.toString(),
      'pageSize': pageSize.toString(),
      'keyword': keyowrd ?? ''
    };
    final response = await HttpHelper.get('v1/lessons', null, queryParameters);
    final data = BaseResponseModel.fromJson(jsonDecode(response.body), (json) {
      final list = json as List;
      return list.map((l) => LessonResponseModel.fromJson(l)).toList();
    });
    return data;
  }

  Future<BaseResponseModel<LessonDetailResponseModel>> getLessonDetail(
      String id) async {
    final response = await HttpHelper.get('v1/lessons/$id', null, null);
    final data = BaseResponseModel.fromJson(jsonDecode(response.body), (json) {
      return LessonDetailResponseModel.fromJson(json as Map<String, dynamic>);
    });
    return data;
  }
}
