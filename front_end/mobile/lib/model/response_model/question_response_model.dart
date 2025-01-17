class QuestionResponseModel {
  String id;
  String content;
  String? description;
  String lessonId;
  dynamic lesson;
  List<AnswerResponseModel> answers;

  QuestionResponseModel({
    required this.id,
    required this.content,
    this.description,
    required this.lessonId,
    this.lesson,
    required this.answers,
  });

  factory QuestionResponseModel.fromJson(Map<String, dynamic> json) {
    return QuestionResponseModel(
      id: json['Id'],
      content: json['Content'],
      description: json['Description'],
      lessonId: json['LessonId'],
      lesson: json['Lesson'],
      answers: (json['Answers'] as List)
          .map((answer) => AnswerResponseModel.fromJson(answer))
          .toList(),
    );
  }
}

class AnswerResponseModel {
  String id;
  String content;
  bool isCorrect;

  AnswerResponseModel({
    required this.id,
    required this.content,
    required this.isCorrect,
  });

  factory AnswerResponseModel.fromJson(Map<String, dynamic> json) {
    return AnswerResponseModel(
      id: json['Id'],
      content: json['Content'],
      isCorrect: json['IsCorrect'],
    );
  }
}
