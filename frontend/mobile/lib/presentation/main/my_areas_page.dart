import 'package:area/l10n/app_localizations.dart';
import 'package:area/layout/main_page_layout.dart';
import 'package:area/widget/clickable_frame.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class MyAreasPage extends StatelessWidget {

  const MyAreasPage({
    super.key
  });

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final textTheme = Theme.of(context).textTheme;

    return MainPageLayout(
      title: l10n.my_areas_page_title,
      children: [
        Text(
          'You have no AREA created for now.',
          style: textTheme.titleMedium,
        ),
        Divider(
          color: Colors.grey.shade300,
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          spacing: 10,
          children: [
            Text(
              'Want to add an AREA?'
            ),
            ClickableFrame(
              onTap: () {
                context.push('/new_area');
              },
              borderRadius: 10,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                child: Text(
                  'Add AREA',
                  style: textTheme.titleSmall,
                ),
              )
            )
          ],
        )
      ],
    );
  }

}
