import 'package:area/layout/main_page_layout.dart';
import 'package:area/widget/appbar_button.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class AboutPage extends StatelessWidget {

  const AboutPage({
    super.key
  });

  @override
  Widget build(BuildContext context) {
    return MainPageLayout(
      title: 'About',
      leading: AppbarButton(
        icon: Icons.arrow_back_ios_rounded,
        onTap: () => context.pop()
      ),
      children: [
        // ...
      ]
    );
  }

}
