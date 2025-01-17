import 'package:les_app/model/response_model/lesson_response_model.dart';
import 'package:les_app/model/response_model/question_response_model.dart';
import 'package:les_app/model/response_model/vocabulary_response_model.dart';

class LessonDetailResponseModel extends LessonResponseModel {
  final List<VocabularyResponseModel> vocabularies;
  final List<QuestionResponseModel> questions;
  LessonDetailResponseModel(this.vocabularies, this.questions,
      {required super.id,
      required super.title,
      required super.toTalQuestion,
      required super.totalView,
      required super.lessonCategoryName});

  factory LessonDetailResponseModel.fromJson(Map<String, dynamic> json) {
    return LessonDetailResponseModel(
      (json['Vocabularies'] as List)
          .map((vocabulary) => VocabularyResponseModel.fromJson(vocabulary))
          .toList(),
      (json['Questions'] as List)
          .map((question) => QuestionResponseModel.fromJson(question))
          .toList(),
      id: json['Id'],
      title: json['Title'],
      toTalQuestion: json['TotalQuestion'],
      totalView: json['TotalView'],
      lessonCategoryName: '',
    );
  }
}
