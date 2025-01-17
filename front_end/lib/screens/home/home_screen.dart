import 'package:flutter/material.dart';
import 'package:les_app/screens/account/account_screen.dart';
import 'package:les_app/screens/history/history_screen.dart';
import 'package:les_app/screens/home/home_body_screen.dart';
import 'package:les_app/screens/library/library_screen.dart';
import 'package:les_app/theme/theme.dart';
import 'package:les_app/widgets/custom_bottom_navigation_bar.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final List<ItemData> items = [
    ItemData(
        icons: Icons.home, label: 'Home', size: 30.0, page: HomeBodyScreen()),
    ItemData(
        icons: Icons.library_books,
        label: 'Library',
        size: 30.0,
        page: LibraryScreen()),
    ItemData(
        icons: Icons.history,
        label: 'History',
        size: 30.0,
        page: HistoryScreen()),
    ItemData(
        icons: Icons.person,
        label: 'Account',
        size: 30.0,
        page: AccountScreen()),
  ];

  @override
  void initState() {
    super.initState();
  }

  void _onItemTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
      ),
      bottomNavigationBar: CustomBottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: _onItemTapped,
        items: items,
        selectedItemColor: AppTheme.primaryColor,
      ),
      body: items[_currentIndex].page,
    );
  }
}
