import 'package:area/data/provider/area_modal_provider.dart';
import 'package:area/data/provider/platform_provider.dart';
import 'package:area/layout/main_page_layout.dart';
import 'package:area/model/platform_model.dart';
import 'package:area/widget/appbar_button.dart';
import 'package:area/widget/clickable_frame.dart';
import 'package:area/widget/platform_card.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gap/gap.dart';
import 'package:go_router/go_router.dart';

class ChooseTriggerPlatformPage extends ConsumerStatefulWidget {

  const ChooseTriggerPlatformPage({
    super.key
  });

  @override
  ConsumerState<ChooseTriggerPlatformPage> createState() => _ChooseTriggerPlatformPageState();

}

class _ChooseTriggerPlatformPageState extends ConsumerState<ChooseTriggerPlatformPage> {

  final _searchBarController = TextEditingController();

  @override
  void dispose() {
    _searchBarController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final platforms = ref.watch(platformsProvider);

    return MainPageLayout(
      title: 'Choose a platform',
      leading: AppbarButton(
        icon: Icons.arrow_back_ios_rounded,
        onTap: () {
          context.pop();
        }
      ),
      children: [
        CupertinoSearchTextField(
          autocorrect: false,
          controller: _searchBarController,
          style: Theme.of(context).textTheme.bodyLarge,
        ),
        platforms.when(
          data: (platformsList) {
            return Wrap(
              spacing: 20,
              runSpacing: 20,
              children: platformsList
                .map((e) {
                  final width = (MediaQuery.of(context).size.width / 2) - 20 - 10;
                  return SizedBox(
                    width: width,
                    child: PlatformCard(
                      platform: e,
                      available: e.triggers.length,
                      onTap: () {
                        ref.read(areaModalProvider.notifier)
                          ..setActionPlatform(e)
                          ..setTrigger(null);
                        // context.pop();
                      },
                    ),
                  );
                })
                .toList(),
            );
          },
          error: (error, _) {
            return Center(child: Text('Error: $error')); // todo: better ui lol
          },
          loading: () {
            return Center(
              child: CircularProgressIndicator(),
            );
          }
        ),
        ElevatedButton(
          onPressed: () {
            ref.read(platformsProvider.notifier).refresh(forceRefresh: true);
          },
          child: Text('Refresh platforms (TMP)')
        )
      ]
    );
  }

}
