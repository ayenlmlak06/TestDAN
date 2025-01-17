import 'package:flutter/material.dart';
import 'package:les_app/common/cache_key.dart';
import 'package:les_app/common/secure_storage_helper.dart';
import 'package:les_app/model/response_model/lesson_category_response_model.dart';
import 'package:les_app/model/response_model/lesson_response_model.dart';
import 'package:les_app/screens/home/category_detail_screen.dart';
import 'package:les_app/services/home_service.dart';
import 'package:les_app/theme/theme.dart';
import 'package:shimmer/shimmer.dart';

class HomeBodyScreen extends StatefulWidget {
  const HomeBodyScreen({super.key});

  @override
  State<HomeBodyScreen> createState() => _HomeBodyScreenState();
}

class _HomeBodyScreenState extends State<HomeBodyScreen> {
  final SecureStorageHelper _storage = SecureStorageHelper();
  List<LessonCategoryResponseModel> _menuData = [];
  List<LessonResponseModel> _hotLessonData = [];
  bool _isLoading = true;
  String? userName;

  @override
  void initState() {
    super.initState();
    _loadMenuData();
    _isLoading = true;
  }

  @override
  void dispose() {
    super.dispose();
  }

  Future<void> _loadMenuData() async {
    final cachedMenuCategory = await _storage.getData(CacheKey.menuCategory);
    final cachedHotLessonData = await _storage.getData(CacheKey.hotLesson);
    final userName = await _storage.getData(CacheKey.userName);

    if (cachedMenuCategory != null && cachedHotLessonData != null) {
      setState(() {
        this.userName = userName;
        _menuData =
            LessonCategoryResponseModel.fromJsonList(cachedMenuCategory);
        _hotLessonData = LessonResponseModel.fromJsonList(cachedHotLessonData);
        _isLoading = false;
      });
    } else {
      final menuData = await HomeService().getHomeData();
      final hotLesson = await HomeService().getHotLesson();
      await _storage.saveData(CacheKey.menuCategory,
          LessonCategoryResponseModel.toJsonList(menuData.data));
      await _storage.saveData(
          CacheKey.hotLesson, LessonResponseModel.toJsonList(hotLesson.data));
      setState(() {
        this.userName = userName;
        _menuData = menuData.data ?? [];
        _hotLessonData = hotLesson.data ?? [];
        _isLoading = false;
      });
    }
  }

  Future<void> _refreshLibraryData() async {
    await _storage.deleteData(CacheKey.menuCategory);
    await _storage.deleteData(CacheKey.hotLesson);
    setState(() {
      _isLoading = true;
    });
    await _loadMenuData();
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: _refreshLibraryData,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildWelcomeCard(),
            const SizedBox(height: 16),
            _buildGridMenu(),
            const SizedBox(height: 16),
            _buildHotLessons(),
          ],
        ),
      ),
    );
  }

  Widget _buildWelcomeCard() {
    return Container(
      height: 100,
      width: double.infinity,
      decoration: BoxDecoration(
        color: AppTheme.primaryColor,
        borderRadius: BorderRadius.all(Radius.circular(12)),
      ),
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Hi, ${userName ?? 'User'}",
                  style: TextStyle(
                    color: AppTheme.textPrimary,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  "Hope use enjoy your lessons",
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
            (_isLoading
                ? Shimmer.fromColors(
                    baseColor: Colors.grey[300]!,
                    highlightColor: Colors.grey[100]!,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: CircleAvatar(
                        radius: 30,
                        backgroundColor: Colors.grey,
                      ),
                    ),
                  )
                : CircleAvatar(
                    radius: 30,
                    backgroundImage: NetworkImage(
                      "https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar-thumbnail.png",
                    ),
                  )),
          ],
        ),
      ),
    );
  }

  Widget _buildGridMenu() {
    return GridView.builder(
      itemCount: _menuData.isEmpty ? 4 : _menuData.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 24,
        mainAxisSpacing: 24,
      ),
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemBuilder: (context, index) {
        return _isLoading
            ? _buildShimmerGridItem()
            : _buildGridItem(_menuData[index]);
      },
    );
  }

  Widget _buildGridItem(LessonCategoryResponseModel item) {
    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
              builder: (context) => CategoryDetailScreen(
                    item: item,
                  )),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.primaryColor,
          borderRadius: const BorderRadius.all(
            Radius.circular(12),
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Image.network(
                item.thumbnail,
                width: 100,
                height: 100,
              ),
              const SizedBox(height: 8),
              Text(
                item.name,
                style: const TextStyle(
                  color: AppTheme.textPrimary,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHotLessons() {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Hot Lesson',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const Divider(color: AppTheme.primaryColor),
          Expanded(
            child: ListView.builder(
              itemCount: _hotLessonData.isEmpty ? 5 : _hotLessonData.length,
              itemBuilder: (context, index) {
                return _isLoading
                    ? _buildShimmerLessonCard()
                    : _buildLessonCard(_hotLessonData[index]);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLessonCard(LessonResponseModel item) {
    return Container(
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

  Widget _buildShimmerGridItem() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey[300], // Base shimmer background color
        borderRadius: const BorderRadius.all(Radius.circular(12)),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Shimmer.fromColors(
              baseColor: Colors.grey[300]!,
              highlightColor: Colors.grey[100]!,
              child: Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: Colors.grey,
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
            const SizedBox(height: 8),
            Shimmer.fromColors(
              baseColor: Colors.grey[300]!,
              highlightColor: Colors.grey[100]!,
              child: Container(
                width: double.infinity,
                height: 24,
                decoration: BoxDecoration(
                  color: Colors.grey,
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
