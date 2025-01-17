class LoginGoogleModel {
  final String email;
  final String avatar;

  LoginGoogleModel({required this.email, required this.avatar});

  Map<String, dynamic> toJson() {
    return {
      'Email': email,
      'Avatar': avatar,
    };
  }
}
