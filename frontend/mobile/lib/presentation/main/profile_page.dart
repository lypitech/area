import 'package:area/l10n/app_localizations.dart';
import 'package:area/layout/main_page_layout.dart';
import 'package:flutter/material.dart';

class ProfilePage extends StatelessWidget {

  const ProfilePage({
    super.key
  });

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return MainPageLayout(
      title: l10n.profile_page_title,
      children: [

      ],
    );
  }

}
