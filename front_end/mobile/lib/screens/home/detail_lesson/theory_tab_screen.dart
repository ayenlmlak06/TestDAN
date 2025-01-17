import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:les_app/model/response_model/lesson_detail_response_model.dart';
import 'package:les_app/model/response_model/vocabulary_response_model.dart';
import 'package:les_app/theme/theme.dart';

enum TtsState { playing, stopped, paused, continued }

class TheoryTabScreen extends StatefulWidget {
  final LessonDetailResponseModel lessonDetail;
  const TheoryTabScreen({
    super.key,
    required this.lessonDetail,
  });

  @override
  State<TheoryTabScreen> createState() => _TheoryTabScreenState();
}

class _TheoryTabScreenState extends State<TheoryTabScreen> {
  late FlutterTts flutterTts;
  List<bool> isSelected = [];
  double volume = 1;
  double pitch = 1.0;
  double rate = 0.5;
  TtsState ttsState = TtsState.stopped;

  bool get isPlaying => ttsState == TtsState.playing;

  @override
  void initState() {
    super.initState();
    initTts();
    isSelected =
        List.generate(widget.lessonDetail.questions.length, (index) => false);
  }

  @override
  void dispose() {
    flutterTts.stop();
    super.dispose();
  }

  void initTts() {
    flutterTts = FlutterTts();
    flutterTts.setLanguage("en-US");
    _setAwaitOptions();

    if (!kIsWeb && Platform.isAndroid) {
      _getDefaultEngine();
      _getDefaultVoice();
    }

    flutterTts.setStartHandler(() {
      setState(() => ttsState = TtsState.playing);
    });

    flutterTts.setCompletionHandler(() {
      setState(() => ttsState = TtsState.stopped);
    });

    flutterTts.setCancelHandler(() {
      setState(() => ttsState = TtsState.stopped);
    });

    flutterTts.setPauseHandler(() {
      setState(() => ttsState = TtsState.paused);
    });

    flutterTts.setContinueHandler(() {
      setState(() => ttsState = TtsState.continued);
    });

    flutterTts.setErrorHandler((msg) {
      setState(() => ttsState = TtsState.stopped);
    });
  }

  Future<void> _getDefaultEngine() async {
    await flutterTts.getDefaultEngine;
  }

  Future<void> _getDefaultVoice() async {
    await flutterTts.getDefaultVoice;
  }

  Future<void> _speak(String? text, int index) async {
    await flutterTts.setVolume(volume);
    await flutterTts.setSpeechRate(rate);
    await flutterTts.setPitch(pitch);

    if (text != null && text.isNotEmpty) {
      await flutterTts.speak(text);
      setState(() {
        isSelected[index] = !isSelected[index];
      });
    }
  }

  Future<void> _setAwaitOptions() async {
    await flutterTts.awaitSpeakCompletion(true);
  }

  Future<void> _stop() async {
    var result = await flutterTts.stop();
    if (result == 1) {
      setState(() => ttsState = TtsState.stopped);
    }
  }

  Future<void> _pause() async {
    var result = await flutterTts.pause();
    if (result == 1) {
      setState(() => ttsState = TtsState.paused);
    }
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: () async {
        await Future.delayed(const Duration(milliseconds: 5));
      },
      child: ListView.builder(
        itemCount: widget.lessonDetail.vocabularies.length ?? 0,
        itemBuilder: (context, index) {
          return _buildVocabularyItem(
              widget.lessonDetail.vocabularies[index], index);
        },
      ),
    );
  }

  Widget _buildVocabularyItem(VocabularyResponseModel? vocabulary, int index) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0)),
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildImage(),
            const SizedBox(width: 16.0),
            _buildContent(vocabulary, index),
          ],
        ),
      ),
    );
  }

  Widget _buildImage() {
    return Container(
      height: 100,
      width: 80,
      decoration: BoxDecoration(borderRadius: BorderRadius.circular(4.0)),
      child: Image.asset(
        'assets/images/folders 1.png',
        fit: BoxFit.contain,
      ),
    );
  }

  Widget _buildContent(VocabularyResponseModel? vocabulary, int index) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildWordWithPronunciation(vocabulary),
          const SizedBox(height: 10.0),
          _buildPronunciationRow(vocabulary, index),
          const SizedBox(height: 8.0),
          _buildExample(vocabulary),
          const SizedBox(height: 8.0),
        ],
      ),
    );
  }

  Widget _buildWordWithPronunciation(VocabularyResponseModel? vocabulary) {
    return RichText(
      text: TextSpan(
        style: TextStyle(color: Colors.black),
        children: [
          TextSpan(
            text: vocabulary?.word ?? '',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.blue,
            ),
          ),
          TextSpan(
            text: '     ',
            style: TextStyle(fontSize: 10),
          ),
          TextSpan(
            text: vocabulary?.meaning ?? '',
            style: TextStyle(
              fontSize: 16,
              fontStyle: FontStyle.italic,
              color: Colors.grey,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPronunciationRow(
      VocabularyResponseModel? vocabulary, int index) {
    return Row(
      children: [
        InkWell(
          onTap: () {
            setState(() {
              isSelected[index] = !isSelected[index];
              _speak(vocabulary?.word, index);
            });
          },
          child: Icon(
            isSelected[index] ? Icons.pause_circle : Icons.play_circle,
            size: 24.0,
            color: AppTheme.primaryColor,
          ),
        ),
        const SizedBox(width: 10.0),
        Text(
          vocabulary?.pronunciation ?? '',
          style: TextStyle(
            fontSize: 16,
            color: AppTheme.textSecondary,
          ),
        ),
      ],
    );
  }

  Widget _buildExample(VocabularyResponseModel? vocabulary) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Ex: ',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.green,
          ),
        ),
        Expanded(
          child: Text(
            vocabulary?.example ?? '',
            style: TextStyle(fontSize: 14),
          ),
        ),
      ],
    );
  }
}
