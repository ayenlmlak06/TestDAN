import 'package:flutter/material.dart';
import 'package:les_app/model/response_model/lesson_category_response_model.dart';
import 'package:les_app/model/response_model/lesson_response_model.dart';
import 'package:les_app/screens/home/detail_lesson/detail_lesson_screen.dart';
import 'package:les_app/services/home_service.dart';
import 'package:les_app/theme/theme.dart';
import 'package:shimmer/shimmer.dart';

class CategoryDetailScreen extends StatefulWidget {
  final LessonCategoryResponseModel item;
  const CategoryDetailScreen({super.key, required this.item});

  @override
  State<CategoryDetailScreen> createState() => _CategoryDetailScreenState();
}

class _CategoryDetailScreenState extends State<CategoryDetailScreen> {
  List<LessonResponseModel> _items = [];
  final int _pageSize = 50;
  int _pageIndex = 1;
  int _totalRecords = 0;
  String? _keyword;
  bool _isLoading = true;
  bool _isError = false;
  final ScrollController _scrollController = ScrollController();
  late FocusNode _focusNode;

  @override
  void initState() {
    super.initState();
    _isLoading = true;
    _scrollController.addListener(_onScroll);
    _focusNode = FocusNode();
    _fetchData();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  Future<void> _fetchData() async {
    final responseData = await HomeService()
        .getLessonByCategory(widget.item.id, _pageIndex, _pageSize, _keyword);

    if (responseData.statusCode == 200) {
      setState(() {
        _items.addAll(responseData.data!);
        _totalRecords = responseData.totalRecord;
        _pageIndex++;
        _isLoading = false;
        if (responseData.data!.isEmpty) {
          _isError = true;
        }
      });
    } else {
      setState(() {
        _isError = true;
        _isLoading = false;
      });
    }
  }

  void _onScroll() {
    if (_scrollController.position.pixels ==
        _scrollController.position.maxScrollExtent) {
      _fetchData(); // Load next page
    }
  }

  Future<void> _submitSearch(String keyword) async {
    setState(() {
      _isLoading = true;
      _items.clear();
      _pageIndex = 1;
      _keyword = keyword;
      _focusNode.unfocus();
    });
    await _fetchData();
  }

  Future<void> _refreshData() async {
    await Future.delayed(Duration(seconds: 2));
    print("Library data refreshed");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppTheme.primaryColor,
        title: Center(
          child: Text(
            widget.item.name,
            style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: AppTheme.textPrimary),
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
      ),
      body: _isError ? _buidErrorPage() : _buildBodyPage(),
    );
  }

  Widget _buildBodyPage() {
    return Padding(
      padding: EdgeInsets.all(20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: EdgeInsets.symmetric(horizontal: 16),
            height: 60.0,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 20,
                  offset: Offset(0, 5),
                )
              ],
            ),
            child: Center(
              child: TextField(
                decoration: InputDecoration(
                  hintText: 'Search ...',
                  hintStyle:
                      TextStyle(color: AppTheme.textSecondary, fontSize: 18.0),
                  border: InputBorder.none,
                  prefixIcon: Icon(
                    Icons.search,
                    color: AppTheme.primaryColor,
                  ),
                ),
                onSubmitted: _submitSearch,
                onChanged: (value) {
                  if (value.isEmpty) {
                    _submitSearch('');
                  }
                },
                focusNode: _focusNode,
              ),
            ),
          ),
          SizedBox(
            height: 16.0,
          ),
          Text(
            'Hot lesson',
            style: TextStyle(
                fontSize: 20,
                letterSpacing: 1.5,
                fontWeight: FontWeight.bold,
                color: AppTheme.primaryColor),
          ),
          Divider(color: AppTheme.primaryColor),
          Expanded(
              child: RefreshIndicator(
            onRefresh: _refreshData,
            child: ListView.builder(
              itemCount: _items.length + (_isLoading ? 5 : 0),
              itemBuilder: (context, index) {
                if (_isLoading) {
                  return _buildShimmerLessonCard();
                } else {
                  if (index < _items.length) {
                    return _buildLessonCard(_items[index]);
                  } else {
                    return Center(
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: CircularProgressIndicator(),
                      ),
                    );
                  }
                }
              },
            ),
          ))
        ],
      ),
    );
  }

  Widget _buidErrorPage() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.error,
            color: Colors.red,
            size: 50,
          ),
          const SizedBox(height: 10),
          Text(
            'Không có dữ liệu',
            style: TextStyle(
              color: Colors.red,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 10),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _isLoading = true;
                _isError = false;
              });
              _fetchData();
            },
            child: Text('Try again'),
          ),
        ],
      ),
    );
  }

  Widget _buildLessonCard(LessonResponseModel item) {
    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => DetailLessonScreen(
              lesson: item,
            ),
          ),
        );
      },
      child: Container(
        height: 100,
        margin: const EdgeInsets.only(top: 16),
        decoration: BoxDecoration(
          color: Colors.teal,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Row(
          children: [
            const SizedBox(width: 10),
            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: item.thumbnail != null
                  ? Image.network(
                      item.thumbnail!,
                      width: 80,
                      height: 80,
                      fit: BoxFit.cover,
                    )
                  : Image.asset(
                      'assets/images/folders 1.png',
                      width: 80,
                      height: 80,
                      fit: BoxFit.cover,
                    ),
            ),
            SizedBox(width: 10),
            Expanded(
              child: Padding(
                padding: EdgeInsets.all(10.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    RichText(
                      text: TextSpan(
                        children: [
                          TextSpan(
                            text: '${item.lessonCategoryName}: ',
                            style: TextStyle(
                              color: AppTheme.textPrimary,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          TextSpan(
                            text: item.title,
                            style: TextStyle(
                              color: AppTheme.textPrimary,
                              fontSize: 14,
                              fontStyle: FontStyle.italic,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 5),
                    Text(
                      '${item.toTalQuestion} Questions | ${item.totalView} views',
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildShimmerLessonCard() {
    return Container(
      height: 100,
      margin: const EdgeInsets.only(top: 16),
      decoration: BoxDecoration(
        color: Colors.grey[300], // Placeholder background color
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        children: [
          const SizedBox(width: 10),
          Shimmer.fromColors(
            baseColor: Colors.grey[300]!,
            highlightColor: Colors.grey[100]!,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: Container(
                width: 80,
                height: 80,
                color: Colors.grey,
              ),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(10.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Shimmer.fromColors(
                    baseColor: Colors.grey[300]!,
                    highlightColor: Colors.grey[100]!,
                    child: Container(
                      height: 16,
                      width: double.infinity,
                      color: Colors.grey,
                    ),
                  ),
                  const SizedBox(height: 5),
                  Shimmer.fromColors(
                    baseColor: Colors.grey[300]!,
                    highlightColor: Colors.grey[100]!,
                    child: Container(
                      height: 14,
                      width: 150,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
