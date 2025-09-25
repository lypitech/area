import 'package:area/widget/clickable_frame.dart';
import 'package:flutter/material.dart';

class AppbarButton extends StatelessWidget {

  final IconData icon;
  final VoidCallback onTap;

  const AppbarButton({
    required this.icon,
    required this.onTap,
    super.key
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: ClickableFrame(
        onTap: onTap,
        borderRadius: 15,
        child: Center(
          child: Icon(icon),
        )
      ),
    );
  }

}
