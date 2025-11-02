import 'package:flutter/material.dart';
import 'package:gap/gap.dart';

class PopupMenuSingleItem extends StatelessWidget {

  final String text;
  final IconData icon;

  const PopupMenuSingleItem({
    super.key,
    required this.text,
    required this.icon
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(
          icon,
          color: Theme.of(context).textTheme.titleLarge?.color,
        ),
        Gap(10),
        Text(text)
      ],
    );
  }

}
