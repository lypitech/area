import 'package:area/widget/clickable_frame.dart';
import 'package:flutter/material.dart';

class AreactionCard extends StatelessWidget {

  final String title;
  final String subtitle;
  // todo: icon
  final VoidCallback onTap;

  const AreactionCard({
    required this.title,
    required this.subtitle,
    required this.onTap,
    super.key
  });

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return ClickableFrame(
      padding: const EdgeInsets.all(20),
      onTap: onTap,
      child: Row(
        spacing: 10,
        children: [
          Container(
            height: 64,
            width: 64,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
            ),
            child: Placeholder(), // TODO: Put platform icon
          ),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  subtitle,
                  style: textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.w300
                  ),
                ),
                Text(
                  title,
                  style: textTheme.titleMedium?.copyWith(
                    fontSize: 20
                  ),
                )
              ],
            ),
          ),
          Icon(
            Icons.arrow_forward_ios_rounded
          )
        ],
      )
    );
  }

}
