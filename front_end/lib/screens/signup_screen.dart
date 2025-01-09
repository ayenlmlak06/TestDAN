import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:les_app/common/http_helper.dart';
import 'package:les_app/common/toast_helper.dart';
import 'package:les_app/screens/login_screen.dart';
import 'package:les_app/services/auth_service.dart';
import 'package:les_app/theme/theme.dart';
import 'package:les_app/widgets/custom_text_filed.dart';
import 'package:les_app/widgets/gradient_button.dart';
import 'package:les_app/widgets/social_login_button.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  String? _password;
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  String? _validateData() {
    String? email = _emailController.text;
    String? password = _passwordController.text;
    String? confirmPassword = _confirmPasswordController.text;
    if (email.isEmpty) return 'Please enter your email.';
    if (!email.contains('@')) return 'Please enter a valid email.';
    if (password.isEmpty) return 'Please enter your password.';
    if (password.length < 6) return 'Password must least 6-digit character.';
    if (confirmPassword.isEmpty) return 'Please enter your confirm password.';
    if (confirmPassword != password) return 'Password does not match.';
    return null;
  }

  void _signUp() async {
    EasyLoading.show(status: 'Loading...');
    String? errorMessage = _validateData();
    if (errorMessage != null) {
      ToastHelper.showToast(errorMessage, Colors.white, AppTheme.error);
      EasyLoading.dismiss();
      return;
    }

    final response = await AuthService().handleRegister(
      _emailController.text,
      _passwordController.text,
    );
    EasyLoading.dismiss();

    if (response.statusCode == 200) {
      ToastHelper.showToast(
          'Đăng ký thành công', Colors.white, AppTheme.success);
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => LoginScreen()),
      );
    } else {
      ToastHelper.showToast(response.message, Colors.white, AppTheme.error);
    }
  }

  @override
  Widget build(BuildContext context) {
    final _diameter = MediaQuery.of(context).size.width;
    return Scaffold(
      body: SingleChildScrollView(
        child: SizedBox(
          height: MediaQuery.of(context).size.height,
          child: Stack(
            children: [
              Positioned(
                top: 0,
                left: 0,
                right: 0,
                child: Image.asset(
                  'assets/images/background.png',
                  fit: BoxFit.cover,
                ),
              ),
              Positioned(
                top: MediaQuery.of(context).size.height * 0.35,
                left: 0,
                right: 0,
                child: Center(
                  child: Column(
                    children: [
                      Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            SizedBox(
                              height: 32,
                            ),
                            Text(
                              "Register your account",
                              style: TextStyle(
                                color: AppTheme.textPrimary,
                                fontSize: 14,
                              ),
                            ),
                            SizedBox(
                              height: 8,
                            ),
                            Padding(
                              padding: EdgeInsets.all(20),
                              child: Form(
                                key: _formKey,
                                child: Column(
                                  children: [
                                    CustomTextField(
                                      label: 'Email',
                                      controller: _emailController,
                                      prefixIcon: Icons.email_outlined,
                                      keyboardType: TextInputType.emailAddress,
                                    ),
                                    SizedBox(
                                      height: 16,
                                    ),
                                    CustomTextField(
                                      label: 'Password',
                                      controller: _passwordController,
                                      prefixIcon: Icons.lock_outline,
                                      keyboardType: TextInputType.emailAddress,
                                      isPassword: true,
                                    ),
                                    SizedBox(
                                      height: 16,
                                    ),
                                    CustomTextField(
                                      label: 'Confirm Password',
                                      controller: _confirmPasswordController,
                                      prefixIcon: Icons.lock_outline,
                                      keyboardType: TextInputType.emailAddress,
                                      isPassword: true,
                                    ),
                                    SizedBox(
                                      height: 16,
                                    ),
                                    GradientButton(
                                      text: 'Sign Up',
                                      onPressed: _signUp,
                                    ),
                                    SizedBox(
                                      height: 24,
                                    ),
                                    Center(
                                      child: Text(
                                        'Or continue with',
                                        style: TextStyle(
                                          color: AppTheme.textSecondary,
                                          fontSize: 14,
                                        ),
                                      ),
                                    ),
                                    SizedBox(
                                      height: 24,
                                    ),
                                    Row(
                                      children: [
                                        Expanded(
                                          child: SocialLoginButton(
                                              text: 'Google',
                                              iconPath:
                                                  'assets/icons/google.png',
                                              onPressed: () {}),
                                        ),
                                        SizedBox(
                                          width: 16,
                                        ),
                                        Expanded(
                                          child: SocialLoginButton(
                                              text: 'Apple',
                                              iconPath:
                                                  'assets/icons/apple.png',
                                              onPressed: () {}),
                                        ),
                                      ],
                                    ),
                                    SizedBox(
                                      height: 12,
                                    ),
                                    Center(
                                      child: Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        children: [
                                          Text(
                                            "Already have an account?",
                                            style: TextStyle(
                                                color: AppTheme.textSecondary),
                                          ),
                                          TextButton(
                                              onPressed: () {
                                                Navigator.push(
                                                    context,
                                                    MaterialPageRoute(
                                                        builder: (context) =>
                                                            LoginScreen()));
                                              },
                                              child: Text('Login'))
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            )
                          ],
                        ),
                      )
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
