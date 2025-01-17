import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:les_app/model/response_model/lesson_detail_response_model.dart';
import 'package:les_app/model/response_model/lesson_response_model.dart';
import 'package:les_app/model/response_model/vocabulary_response_model.dart';
import 'package:les_app/screens/home/detail_lesson/practice_tab_screen.dart';
import 'package:les_app/screens/home/detail_lesson/theory_tab_screen.dart';
import 'package:les_app/services/home_service.dart';
import 'package:les_app/theme/theme.dart';

class DetailLessonScreen extends StatefulWidget {
  final LessonResponseModel lesson;
  const DetailLessonScreen({super.key, required this.lesson});

  @override
  State<DetailLessonScreen> createState() => _DetailLessonScreenState();
}

class _DetailLessonScreenState extends State<DetailLessonScreen> {
  LessonDetailResponseModel? lessonDetail;
  bool _isLoading = true;
  bool _isError = false;

  @override
  void initState() {
    super.initState();
    _isLoading = true;
    fetchData();
  }

  Future<void> fetchData() async {
    final response =
        await HomeService().getLessonDetail(widget.lesson.id.toString());
    if (response.statusCode == 200) {
      setState(() {
        _isLoading = false;
        lessonDetail = response.data;
      });
    } else {
      setState(() {
        _isLoading = false;
        _isError = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: AppTheme.primaryColor,
          title: const Text(
            'Detail Lesson',
            style: TextStyle(
              color: Colors.yellow,
              fontSize: 18,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.2,
            ),
          ),
          automaticallyImplyLeading: false,
          leading: IconButton(
            onPressed: () => Navigator.pop(context),
            icon: Icon(
              Icons.arrow_back,
              color: Colors.white, // Set the arrow color to white
            ),
          ),
          bottom: const TabBar(
            indicatorColor: AppTheme.textPrimary,
            labelColor: AppTheme.backgroundColor,
            unselectedLabelColor: Colors.white70,
            tabs: [
              Tab(text: 'Lý thuyết'),
              Tab(text: 'Thực hành'),
            ],
            indicatorSize: TabBarIndicatorSize.tab,
          ),
        ),
        body: _isLoading
            ? _buildLoading()
            : _isError
                ? _buildError()
                : _buildTabView(),
      ),
    );
  }

  Widget _buildTabView() {
    return TabBarView(
      children: [
        TheoryTabScreen(
          lessonDetail: lessonDetail!,
        ),
        PracticeTabScreen(lessonDetail: lessonDetail!),
      ],
    );
  }

  //write widget progress bar loading
  Widget _buildLoading() {
    return const Center(
      child: CircularProgressIndicator(),
    );
  }

  Widget _buildError() {
    return const Center(
      child: Text('Error'),
    );
  }
}
