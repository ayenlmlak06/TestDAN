//create class static contain method show toast
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';

class ToastHelper {
  static void showToast(
      String message, Color? backgroundColor, Color? textColor) {
    Fluttertoast.showToast(
      msg: message,
      toastLength: Toast.LENGTH_SHORT,
      gravity: ToastGravity.BOTTOM,
      timeInSecForIosWeb: 1,
      backgroundColor: backgroundColor ?? Colors.white,
      textColor: textColor ?? Colors.black,
      fontSize: 16.0,
    );
  }
}
