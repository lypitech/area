import 'package:flutter/material.dart';
import 'package:gap/gap.dart';

class SettingsTile extends StatelessWidget {

  final String title;
  final VoidCallback? onTap;
  final IconData icon;
  final Color iconBackgroundColor;

  const SettingsTile({
    super.key,
    required this.title,
    this.onTap,
    required this.icon,
    required this.iconBackgroundColor
  });

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(15),
      child: Padding(
        padding: EdgeInsets.all(5),
        child: Row(
          children: [
            Container(
              padding: EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: iconBackgroundColor,
                borderRadius: BorderRadius.circular(15)
              ),
              child: Icon(
                icon,
                color: Colors.white,
              ),
            ),
            Gap(10),
            Text(
              title,
              style: textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w400
              ),
            ),
            if (onTap != null) ... {
              Spacer(),
              Icon(Icons.arrow_forward_ios_rounded)
            }
          ],
        ),
      ),
    );
  }

}
