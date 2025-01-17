import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:les_app/common/toast_helper.dart';
import 'package:les_app/screens/home/home_screen.dart';
import 'package:les_app/screens/auth/signup_screen.dart';
import 'package:les_app/services/auth_service.dart';
import 'package:les_app/theme/theme.dart';
import 'package:les_app/widgets/custom_text_filed.dart';
import 'package:les_app/widgets/gradient_button.dart';
import 'package:les_app/widgets/social_login_button.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _formKey.currentState?.dispose();
    super.dispose();
  }

  String? _validateData() {
    String? email = _emailController.text;
    String? password = _passwordController.text;
    if (email.isEmpty) return 'Please enter your email.';
    if (!email.contains('@')) return 'Please enter a valid email.';
    if (password.isEmpty) return 'Please enter your password.';
    if (password.length < 6) return 'Password must least 6-digit character.';
    return null;
  }

  void _login() async {
    FocusScope.of(context).unfocus();
    String? errorMessage = _validateData();
    if (errorMessage != null) {
      ToastHelper.showToast(errorMessage, Colors.white, AppTheme.error);
      return;
    }

    EasyLoading.show(status: 'Logging in...');

    var response = await AuthService()
        .handleLogin(_emailController.text, _passwordController.text);

    EasyLoading.dismiss();

    if (response.statusCode == 200) {
      // Save access and refresh token and userId to local storage
      await AuthService().saveLoginData(response.data!);
      Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) => HomeScreen()),
          (route) => false);
    } else {
      ToastHelper.showToast(response.message, Colors.white, AppTheme.error);
    }
  }

  void _loginGoogle() async {
    final GoogleSignInAccount? googleUser = await GoogleSignIn().signIn();

    if (googleUser == null) return;

    final GoogleSignInAuthentication googleAuth =
        await googleUser.authentication;

    final credential = GoogleAuthProvider.credential(
      accessToken: googleAuth.accessToken,
      idToken: googleAuth.idToken,
    );

    final profileGogleInfo =
        await FirebaseAuth.instance.signInWithCredential(credential);

    EasyLoading.show(status: 'Logging in...');
    var response = await AuthService()
        .signInWithGoogle((profileGogleInfo.credential?.accessToken ?? ''));
    EasyLoading.dismiss();

    if (response.statusCode == 200) {
      // Save access and refresh token and userId to local storage
      await AuthService().saveLoginData(response.data!);
      Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) => HomeScreen()),
          (route) => false);
    } else {
      await GoogleSignIn().signOut();
      ToastHelper.showToast(response.message, Colors.white, AppTheme.error);
    }
  }

  @override
  Widget build(BuildContext context) {
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
                              "Please login before study",
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
                                    Align(
                                      alignment: Alignment.centerRight,
                                      child: TextButton(
                                        onPressed: () {},
                                        style: TextButton.styleFrom(
                                            foregroundColor:
                                                AppTheme.primaryColor),
                                        child: Text(
                                          'Forgot Password',
                                        ),
                                      ),
                                    ),
                                    SizedBox(
                                      height: 12,
                                    ),
                                    GradientButton(
                                      text: 'Login',
                                      onPressed: _login,
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
                                            iconPath: 'assets/icons/google.png',
                                            onPressed: _loginGoogle,
                                          ),
                                        ),
                                        SizedBox(
                                          width: 16,
                                        ),
                                        Expanded(
                                          child: SocialLoginButton(
                                            text: 'Apple',
                                            iconPath: 'assets/icons/apple.png',
                                            onPressed: () {},
                                          ),
                                        ),
                                      ],
                                    ),
                                    SizedBox(
                                      height: 24,
                                    ),
                                    Center(
                                      child: Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        children: [
                                          Text(
                                            "Don't have an account?",
                                            style: TextStyle(
                                                color: AppTheme.textSecondary),
                                          ),
                                          TextButton(
                                              onPressed: () {
                                                Navigator.push(
                                                    context,
                                                    MaterialPageRoute(
                                                        builder: (context) =>
                                                            SignupScreen()));
                                              },
                                              child: Text('Sign Up'))
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
