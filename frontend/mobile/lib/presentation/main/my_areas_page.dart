import 'package:area/data/provider/area_provider.dart';
import 'package:area/l10n/app_localizations.dart';
import 'package:area/layout/main_page_layout.dart';
import 'package:area/model/user_model.dart';
import 'package:area/widget/area_card.dart';
import 'package:area/widget/clickable_frame.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class MyAreasPage extends ConsumerWidget {

  final UserModel user;

  const MyAreasPage({
    super.key,
    required this.user,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final textTheme = Theme.of(context).textTheme;

    final asyncAreasState = ref.watch(areaStateProvider(user));

    return asyncAreasState.when(
      data: (state) {
        final areas = state.areas;

        return RefreshIndicator(
          onRefresh: () async {
            final notifier = await ref.read(areaNotifierProvider(user).future);
            await notifier.syncAreas();
          },
          child: MainPageLayout(
            title: l10n.my_areas_page_title,
            children: [
              if (areas.isEmpty) ... {
                Text(
                  'You have no AREA created for now.',
                  style: textTheme.titleMedium,
                ),
              } else ... {
                ...areas.map((e) => AreaCard(user: user, area: e))
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
          ),
        );
      },
      error: (err, stack) {
        return Center(
          child: Text(err.toString()),
        );
      },
      loading: () => CircularProgressIndicator()
    );

  }

}
