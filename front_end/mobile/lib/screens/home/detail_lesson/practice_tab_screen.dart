import 'dart:math';

import 'package:flutter/material.dart';
import 'package:les_app/model/response_model/lesson_detail_response_model.dart';
import 'package:les_app/model/response_model/question_response_model.dart';
import 'package:les_app/theme/theme.dart';
import 'package:les_app/widgets/custom_progress_bar.dart';
import 'package:les_app/widgets/gradient_button.dart';

class PracticeTabScreen extends StatefulWidget {
  final LessonDetailResponseModel lessonDetail;
  const PracticeTabScreen({super.key, required this.lessonDetail});

  @override
  State<PracticeTabScreen> createState() => _PracticeTabScreenState();
}

class _PracticeTabScreenState extends State<PracticeTabScreen> {
  PageController _pageController = PageController();
  Map<int, String?> _selectedAnswers = {};
  int _currentPage = 0;
  bool _isSubmit = false;
  int? _correctAnswerCount;
  bool _isOverView = false;

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  Color _getColor(int questionIndex, String answerId, bool isCorrect) {
    if (!_isSubmit) {
      return AppTheme.primaryColor;
    }
    if (isCorrect) {
      return AppTheme.success;
    }
    if (_selectedAnswers[questionIndex] == answerId) {
      return AppTheme.error;
    }
    return AppTheme.primaryColor;
  }

  void _handleSubmit() {
    setState(() {
      _isSubmit = true;
      _correctAnswerCount = 0;
      widget.lessonDetail.questions.asMap().forEach((index, question) {
        if (question.answers.firstWhere((element) => element.isCorrect).id ==
            _selectedAnswers[index]) {
          _correctAnswerCount = _correctAnswerCount! + 1;
        }
      });
      _currentPage = 0;
    });
  }

  void _handleSeeCorrectAnswer() {
    setState(() {
      _isOverView = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        children: [
          Expanded(
            child: (_isSubmit && _correctAnswerCount != null && !_isOverView)
                ? _buildViewAnswerPage()
                : Column(
                    children: [
                      CustomProgressBar(
                        value: _currentPage + 1,
                        maxValue: widget.lessonDetail.questions.length,
                      ),
                      SizedBox(
                        height: 24,
                      ),
                      Expanded(
                        child: PageView.builder(
                          controller: _pageController,
                          onPageChanged: (int page) {
                            setState(() {
                              _currentPage = page;
                            });
                          },
                          itemCount: widget.lessonDetail.questions.length,
                          itemBuilder: (context, questionIndex) {
                            return Column(
                              children: [
                                _buildQuestionPage(widget
                                    .lessonDetail.questions[questionIndex]),
                                SizedBox(
                                  height: 24,
                                ),
                                Expanded(
                                  child: ListView.builder(
                                    itemCount: widget
                                        .lessonDetail
                                        .questions[questionIndex]
                                        .answers
                                        .length,
                                    itemBuilder: (context, answerIndex) {
                                      List<AnswerResponseModel> answers = widget
                                          .lessonDetail
                                          .questions[questionIndex]
                                          .answers;
                                      return _buildAnswerItem(
                                          questionIndex, answers[answerIndex]);
                                    },
                                  ),
                                ),
                              ],
                            );
                          },
                        ),
                      ),
                    ],
                  ),
          ),
          Container(
            height: MediaQuery.of(context).size.height * 0.1,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              children: [
                if (_currentPage > 0 || (_isOverView && !_isSubmit))
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        _pageController.previousPage(
                            duration: Duration(milliseconds: 300),
                            curve: Curves.easeInOut);
                      },
                      style: OutlinedButton.styleFrom(
                        backgroundColor: Colors.grey[200],
                        padding: EdgeInsets.symmetric(vertical: 16),
                        side: BorderSide(color: Colors.grey),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                      ),
                      child: Icon(
                        Icons.arrow_back_ios,
                        color: Colors.black,
                        size: 20,
                      ),
                    ),
                  ),
                if (_currentPage > 0)
                  const SizedBox(
                    width: 16,
                  ),
                if (_currentPage <= widget.lessonDetail.questions.length - 1)
                  Expanded(
                    child: GradientButton(
                      text: _isSubmit
                          ? _isOverView
                              ? _currentPage <
                                      widget.lessonDetail.questions.length - 1
                                  ? 'Next'
                                  : 'Try again'
                              : 'See correct answer'
                          : _currentPage <
                                  widget.lessonDetail.questions.length - 1
                              ? 'Next'
                              : 'Submit',
                      gradient: const [
                        AppTheme.textPrimary,
                        AppTheme.textPrimary
                      ],
                      onPressed: () {
                        if ((_currentPage <
                                    widget.lessonDetail.questions.length - 1 &&
                                !_isSubmit) ||
                            (_currentPage <
                                    widget.lessonDetail.questions.length - 1 &&
                                _isOverView)) {
                          _pageController.nextPage(
                              duration: Duration(milliseconds: 300),
                              curve: Curves.easeInOut);
                        } else if (!_isSubmit) {
                          _handleSubmit();
                        } else if (_isSubmit && !_isOverView) {
                          _handleSeeCorrectAnswer();
                        } else if (_isOverView &&
                            _currentPage ==
                                widget.lessonDetail.questions.length - 1) {
                          setState(() {
                            _isSubmit = false;
                            _isOverView = false;
                            _selectedAnswers = {};
                            _correctAnswerCount = null;
                          });
                        }
                      },
                    ),
                  )
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildQuestionPage(QuestionResponseModel? item) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: AppTheme.primaryColor,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Padding(
        padding: EdgeInsets.all(20.0),
        child: Column(
          children: [
            Text(
              item?.content ?? '',
              style: TextStyle(
                  color: AppTheme.backgroundColor,
                  fontSize: 18,
                  fontWeight: FontWeight.bold),
            ),
            SizedBox(
              height: 10,
            ),
            if (item?.description != null &&
                (item?.description ?? '').isNotEmpty)
              Text(
                item?.description ?? '',
                style: TextStyle(
                  color: AppTheme.backgroundColor,
                  fontSize: 14,
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildAnswerItem(int questionIndex, AnswerResponseModel item) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20.0),
      child: Container(
        width: MediaQuery.of(context).size.width,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
              color: _getColor(questionIndex, item.id, item.isCorrect)),
        ),
        child: Row(
          children: [
            Radio(
              value: item.id,
              groupValue: _selectedAnswers[questionIndex],
              onChanged: _isSubmit
                  ? null
                  : (String? value) {
                      setState(() {
                        _selectedAnswers[questionIndex] = value;
                      });
                    },
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.only(right: 20.0, bottom: 4.0),
                child: Text(
                  item.content,
                  style: TextStyle(color: AppTheme.primaryColor, fontSize: 16),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildViewAnswerPage() {
    return Expanded(
      child: Column(
        children: [
          SizedBox(
            height: MediaQuery.of(context).size.height * 0.2,
          ),
          Text(
            'Your score',
            style: TextStyle(
              color: AppTheme.primaryColor,
              fontSize: 42,
              letterSpacing: 1.2,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(
            height: 24,
          ),
          Container(
            width: MediaQuery.of(context).size.width * 0.7,
            height: MediaQuery.of(context).size.width * 0.7,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.all(Radius.circular(200)),
              border: Border.all(
                color: AppTheme.textPrimary,
                width: 5,
              ),
            ),
            child: Center(
              child: Text(
                '${_correctAnswerCount ?? ''}/${widget.lessonDetail.questions.length}',
                style: TextStyle(
                  color: AppTheme.primaryColor,
                  fontSize: 52,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}
