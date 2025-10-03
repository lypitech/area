import 'package:area/data/provider/area_modal_provider.dart';
import 'package:area/data/provider/platform_provider.dart';
import 'package:area/l10n/app_localizations.dart';
import 'package:area/layout/main_page_layout.dart';
import 'package:area/widget/appbar_button.dart';
import 'package:area/widget/platform_card.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

enum ChoosePlatformPageMode {

  triggers,
  actions;

}

class ChoosePlatformPage extends ConsumerStatefulWidget {

  final ChoosePlatformPageMode mode;

  const ChoosePlatformPage({
    required this.mode,
    super.key
  });

  @override
  ConsumerState<ChoosePlatformPage> createState() => _ChoosePlatformPageState();

}

class _ChoosePlatformPageState extends ConsumerState<ChoosePlatformPage> {

  final _searchBarController = TextEditingController();
  static const double spacing = 20;

  @override
  void dispose() {
    _searchBarController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final platforms = ref.watch(platformsProvider);
    final l10n = AppLocalizations.of(context)!;

    return MainPageLayout(
      title: l10n.choose_platform,
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
              spacing: spacing,
              runSpacing: spacing,
              children: platformsList
                .map((e) {
                  final width = (MediaQuery.of(context).size.width / 2) - spacing - (spacing / 2);

                  return SizedBox(
                    width: width,
                    child: PlatformCard(
                      platform: e,
                      available: widget.mode == ChoosePlatformPageMode.triggers
                        ? e.triggers.length
                        : e.actions.length,
                      onTap: () {
                        final modal = ref.read(areaModalProvider.notifier);
                        String mode = '';

                        if (widget.mode == ChoosePlatformPageMode.triggers) {
                          modal.setActionPlatform(e);
                          modal.setTrigger(null);
                          mode = 'action';
                        }

                        else if (widget.mode == ChoosePlatformPageMode.actions) {
                          modal.setReactionPlatform(e);
                          modal.setAction(null);
                          mode = 'reaction';
                        }

                        context.pushNamed('choose_trigger_action', pathParameters: { 'mode': mode }, extra: e);
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
