import 'dart:convert';

class LessonCategoryResponseModel {
  final String id;
  final String name;
  final String thumbnail;

  LessonCategoryResponseModel({
    required this.id,
    required this.name,
    required this.thumbnail,
  });

  factory LessonCategoryResponseModel.fromJson(Map<String, dynamic> json) {
    return LessonCategoryResponseModel(
      id: json['Id'],
      name: json['Name'],
      thumbnail: json['Thumbnail'],
    );
  }

  static List<LessonCategoryResponseModel> fromJsonList(String jsonString) {
    final List<dynamic> jsonList = jsonDecode(jsonString);
    return jsonList
        .map((json) => LessonCategoryResponseModel.fromJson(json))
        .toList();
  }

  Map<String, dynamic> toJson() {
    return {
      'Id': id,
      'Name': name,
      'Thumbnail': thumbnail,
    };
  }

  static String toJsonList(List<LessonCategoryResponseModel>? list) {
    return jsonEncode(list?.map((e) => e.toJson()).toList());
  }
}
