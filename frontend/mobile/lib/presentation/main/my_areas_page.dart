import 'package:area/data/provider/areas_provider.dart';
import 'package:area/l10n/app_localizations.dart';
import 'package:area/layout/main_page_layout.dart';
import 'package:area/widget/area_card.dart';
import 'package:area/widget/clickable_frame.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class MyAreasPage extends ConsumerWidget {

  const MyAreasPage({
    super.key
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final textTheme = Theme.of(context).textTheme;
    final areas = ref.watch(areasProvider);

    return MainPageLayout(
      title: l10n.my_areas_page_title,
      children: [
        if (areas.isEmpty) ... {
          Text(
            'You have no AREA created for now.',
            style: textTheme.titleMedium,
          ),
        } else ... {
          ...areas.map((e) => AreaCard(area: e))
        },
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
