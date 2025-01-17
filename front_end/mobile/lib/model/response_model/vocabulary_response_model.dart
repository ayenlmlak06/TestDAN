class VocabularyResponseModel {
  String id;
  String word;
  int type;
  String pronunciation;
  String meaning;
  String example;

  VocabularyResponseModel({
    required this.id,
    required this.word,
    required this.type,
    required this.pronunciation,
    required this.meaning,
    required this.example,
  });

  factory VocabularyResponseModel.fromJson(Map<String, dynamic> json) {
    return VocabularyResponseModel(
      id: json['Id'],
      word: json['Word'],
      type: json['Type'],
      pronunciation: json['Pronunciation'],
      meaning: json['Meaning'],
      example: json['Example'],
    );
  }
}
