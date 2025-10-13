import 'package:area/l10n/app_localizations.dart';
import 'package:area/layout/main_page_layout.dart';
import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {

  const HomePage({
    super.key
  });

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return MainPageLayout(
      title: l10n.home_page_title,
      children: [

      ],
    );
  }

}
