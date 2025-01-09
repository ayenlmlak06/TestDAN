class BaseResponseModel<T> {
  final int statusCode;
  final int totalRecord;
  final String message;
  final T? data;

  BaseResponseModel({
    required this.statusCode,
    required this.totalRecord,
    required this.message,
    this.data,
  });

  factory BaseResponseModel.fromJson(
      Map<String, dynamic> json, T Function(Object? json) fromJsonT) {
    return BaseResponseModel(
      statusCode: json['StatusCode'],
      totalRecord: json['TotalRecord'],
      message: json['Message'],
      data: json['Data'] != null ? fromJsonT(json['Data']) : null,
    );
  }
}
