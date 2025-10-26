import 'package:flutter/material.dart';
import 'package:gap/gap.dart';

class ACard extends StatelessWidget {

  final String title;
  final List<Widget>? children;

  const ACard({
    required this.title,
    this.children,
    super.key
  });

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              title,
              style: textTheme.titleMedium,
            ),
            Gap(5),
            ...?children
          ],
        ),
      ),
    );
  }

}
