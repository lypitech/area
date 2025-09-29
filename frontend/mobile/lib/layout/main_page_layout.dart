import 'package:area/widget/a_appbar.dart';
import 'package:area/widget/appbar_button.dart';
import 'package:flutter/material.dart';

class MainPageLayout extends StatelessWidget {

  final String? title;
  final List<Widget> children;
  final AppbarButton? leading;

  const MainPageLayout({
    this.title,
    required this.children,
    this.leading,
    super.key
  });

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      appBar: AAppbar(
        leading: leading,
      ),
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
