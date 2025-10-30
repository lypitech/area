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

  Future<void> _handleTriggerSelection(dynamic triggerOrAction) async {
    final modal = ref.read(areaModalProvider.notifier);
    final isTrigger = widget.mode == ChoosePlatformPageMode.triggers;

    if (triggerOrAction.requiredParams.isNotEmpty) {
      final result = await context.pushNamed(
        'parameter_input',
        pathParameters: {
          'mode': widget.mode == ChoosePlatformPageMode.triggers
            ? 'action'
            : 'reaction',
        },
        extra: {
          'parameters': triggerOrAction.requiredParams,
          'name': triggerOrAction.name,
          'isAction': !isTrigger,
        },
      );

      if (result != null && result is Map<String, dynamic>) {
        if (isTrigger) {
          modal.setTrigger(triggerOrAction);
          modal.setTriggerParameters(result);
        } else {
          modal.setAction(triggerOrAction);
          modal.setActionParameters(result);
        }

        if (mounted) {
          context.goNamed('new_area');
        }
      }
    } else {
      if (isTrigger) {
        modal.setTrigger(triggerOrAction);
        modal.setTriggerParameters({});
      } else {
        modal.setAction(triggerOrAction);
        modal.setActionParameters({});
      }
      context.goNamed('new_area');
    }
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
              parametersAmount: e.requiredParams.isEmpty ? null : e.requiredParams.length,
              onTap: () => _handleTriggerSelection(e),
            ))
        } else ... {
          ...widget.platform.actions
            .map((e) => TriggerActionCard(
              title: e.name,
              description: e.description,
              parametersAmount: e.requiredParams.isEmpty ? null : e.requiredParams.length,
              onTap: () => _handleTriggerSelection(e),
            ))
        }
      ]
    );
  }

}

class TriggerActionCard extends StatelessWidget {

  final String title;
  final String description;
  final int? parametersAmount;
  final VoidCallback onTap;

  const TriggerActionCard({
    required this.title,
    required this.description,
    this.parametersAmount,
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
          ),
          if (parametersAmount != null) ... {
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  Icons.settings,
                  size: 14,
                  color: Colors.blue,
                ),
                const SizedBox(width: 4),
                Text(
                  '$parametersAmount param${parametersAmount! > 1 ? 's' : ''}',
                  style: textTheme.bodySmall?.copyWith(
                    color: Colors.blue,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            )
          }
        ],
      )
    );
  }

}

