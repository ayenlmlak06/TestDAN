class LoginResponseModel {
  final String userId;
  final String userName;
  final String accessToken;
  final String refreshToken;

  LoginResponseModel(
      {required this.userId,
      required this.userName,
      required this.accessToken,
      required this.refreshToken});

  factory LoginResponseModel.fromJson(Map<String, dynamic> json) {
    return LoginResponseModel(
      userId: json['UserId'],
      userName: json['UserName'],
      accessToken: json['AccessToken'],
      refreshToken: json['RefreshToken'],
    );
  }
}
