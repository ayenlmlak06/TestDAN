import 'dart:convert';

class LessonResponseModel {
  final String id;
  final String title;
  final int toTalQuestion;
  final int totalView;
  final String lessonCategoryName;
  final String? thumbnail;

  LessonResponseModel(
      {required this.id,
      required this.title,
      required this.toTalQuestion,
      required this.totalView,
      required this.lessonCategoryName,
      this.thumbnail});

  factory LessonResponseModel.fromJson(Map<String, dynamic> json) {
    return LessonResponseModel(
        id: json['Id'],
        title: json['Title'],
        toTalQuestion: json['TotalQuestion'],
        totalView: json['TotalView'],
        lessonCategoryName: json['LessonCategoryName'],
        thumbnail: json['Thumbnail']);
  }

  static List<LessonResponseModel> fromJsonList(String jsonString) {
    final List<dynamic> jsonList = jsonDecode(jsonString);
    return jsonList.map((json) => LessonResponseModel.fromJson(json)).toList();
  }

  Map<String, dynamic> toJson() {
    return {
      'Id': id,
      'Title': title,
      'TotalQuestion': toTalQuestion,
      'TotalView': totalView,
      'LessonCategoryName': lessonCategoryName,
      'Thumbnail': thumbnail
    };
  }

  static String toJsonList(List<LessonResponseModel>? list) {
    return jsonEncode(list?.map((e) => e.toJson()).toList());
  }
}
