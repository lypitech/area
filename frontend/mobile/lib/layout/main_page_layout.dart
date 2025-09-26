import 'package:area/widget/a_appbar.dart';
import 'package:flutter/material.dart';

class MainPageLayout extends StatelessWidget {

  final String? title;
  final List<Widget> children;

  const MainPageLayout({
    this.title,
    required this.children,
    super.key
  });

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      appBar: AAppbar(),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            spacing: 20,
            children: [
              if (title != null) ... {
                Text(
                  title!,
                  style: textTheme.headlineLarge?.copyWith(
                    fontWeight: FontWeight.w500
                  ),
                ),
              },
              ...children
            ],
          ),
        ),
      ),
    );
  }

}
