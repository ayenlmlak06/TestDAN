import 'package:flutter/material.dart';
import 'package:les_app/theme/theme.dart';

class CustomBottomNavigationBar extends StatelessWidget {
  final int currentIndex;
  final void Function(int) onTap;
  final List<ItemData> items;
  final Color selectedItemColor;
  final Color? unselectedItemColor;

  const CustomBottomNavigationBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
    required this.items,
    required this.selectedItemColor,
    this.unselectedItemColor,
  });

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: currentIndex,
      onTap: onTap,
      type: BottomNavigationBarType.fixed,
      selectedItemColor: selectedItemColor,
      unselectedItemColor: unselectedItemColor ?? Colors.grey,
      showSelectedLabels: true,
      showUnselectedLabels: true,
      items: items
          .map((i) => BottomNavigationBarItem(
                icon: Icon(i.icons, size: i.size),
                label: i.label,
              ))
          .toList(),
    );
  }
}

class ItemData {
  final IconData icons; // Change Icons to IconData
  final String label;
  final double size;
  final Widget page;

  ItemData(
      {required this.icons,
      required this.label,
      required this.size,
      required this.page});
}
