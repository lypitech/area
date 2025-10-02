import 'package:area/data/provider/area_modal_provider.dart';
import 'package:area/data/provider/platform_provider.dart';
import 'package:area/layout/main_page_layout.dart';
import 'package:area/model/platform_model.dart';
import 'package:area/widget/appbar_button.dart';
import 'package:area/widget/clickable_frame.dart';
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
                    child: PlatformCard(platform: e),
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

class PlatformCard extends ConsumerWidget {

  final PlatformModel platform;

  const PlatformCard({
    required this.platform,
    super.key
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final textTheme = Theme.of(context).textTheme;

    return ClickableFrame(
      padding: const EdgeInsets.all(20),
      onTap: () {
        ref.read(areaModalProvider.notifier)
          ..setActionPlatform(platform)
          ..setTrigger(null);
        // context.pop();
      },
      child: Stack(
        children: [
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                height: 48,
                width: 48,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                ),
                child: Placeholder(), // TODO: Put platform icon
              ),
              Gap(5),
              Text(
                platform.name,
                style: textTheme.titleMedium?.copyWith(
                  fontSize: 20
                ),
              ),
              Text(
                '${platform.actions.length} available',
                style: textTheme.bodyMedium,
              )
            ],
          ),
          Positioned(
            top: 0,
            right: 0,
            child: Icon(
              Icons.person_off_rounded,
              color: Colors.red,
              size: 20,
            )
          )
        ],
      )
    );
  }

}

