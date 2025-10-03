import 'package:area/data/provider/area_modal_provider.dart';
import 'package:area/l10n/app_localizations.dart';
import 'package:area/layout/main_page_layout.dart';
import 'package:area/model/platform_model.dart';
import 'package:area/presentation/new_area/choose_platform_page.dart';
import 'package:area/widget/appbar_button.dart';
import 'package:area/widget/clickable_frame.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class ChooseTriggerActionPage extends ConsumerStatefulWidget {

  final PlatformModel platform;
  final ChoosePlatformPageMode mode;

  const ChooseTriggerActionPage({
    required this.platform,
    required this.mode,
    super.key
  });

  @override
  ConsumerState<ChooseTriggerActionPage> createState() => _ChooseTriggerActionPageState();

}

class _ChooseTriggerActionPageState extends ConsumerState<ChooseTriggerActionPage> {

  final _searchBarController = TextEditingController();

  @override
  void dispose() {
    _searchBarController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final mode = widget.mode;
    final title = mode == ChoosePlatformPageMode.triggers
      ? l10n.choose_trigger
      : l10n.choose_action;

    return MainPageLayout(
      title: title,
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
        if (mode == ChoosePlatformPageMode.triggers) ... {
          ...widget.platform.triggers
            .map((e) => TriggerActionCard(
              title: e.name,
              description: e.description,
              onTap: () {
                ref.read(areaModalProvider.notifier).setTrigger(e);
                context.goNamed('new_area');
              }
            ))
        } else ... {
          ...widget.platform.actions
            .map((e) => TriggerActionCard(
            title: e.name,
            description: e.description,
            onTap: () {
              ref.read(areaModalProvider.notifier).setAction(e);
              context.goNamed('new_area');
            }
          ))
        }
      ]
    );
  }

}

class TriggerActionCard extends StatelessWidget {

  final String title;
  final String description;
  final VoidCallback onTap;

  const TriggerActionCard({
    required this.title,
    required this.description,
    required this.onTap,
    super.key
  });

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return ClickableFrame(
      padding: const EdgeInsets.all(20),
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: 5,
        children: [
          Text(
            title,
            style: textTheme.titleMedium?.copyWith(
              fontSize: 20,
              height: 1.2
            ),
          ),
          Text(
            description,
            style: textTheme.bodyMedium,
          )
        ],
      )
    );
  }

}

