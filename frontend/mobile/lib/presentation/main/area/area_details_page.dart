import 'package:area/core/utils.dart';
import 'package:area/data/provider/area_provider.dart';
import 'package:area/data/provider/platforms_icons_provider.dart';
import 'package:area/layout/main_page_layout.dart';
import 'package:area/model/area_history_entry.dart';
import 'package:area/model/area_model.dart';
import 'package:area/model/user_model.dart';
import 'package:area/presentation/dialog/error_dialog.dart';
import 'package:area/widget/appbar_button.dart';
import 'package:area/widget/areaction_card.dart';
import 'package:area/widget/clickable_frame.dart';
import 'package:area/widget/popup_menu_button.dart';
import 'package:area/widget/popup_menu_single_item.dart';
import 'package:area/widget/when_then_do.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class AreaDetailsPage extends ConsumerStatefulWidget {

  final UserModel user;
  final AreaModel area;

  const AreaDetailsPage({
    required this.user,
    required this.area,
    super.key
  });

  @override
  ConsumerState<AreaDetailsPage> createState() => _AreaDetailsPageState();
}

class _AreaDetailsPageState extends ConsumerState<AreaDetailsPage> {

  late AreaModel area;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    area = widget.area;
  }

  Future<void> _refreshArea() async {
    final repo = await ref.read(areaRepositoryProvider.future);
    area = await repo.refreshArea(user: widget.user, areaUuid: area.uuid!);
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final textTheme = theme.textTheme;
    final iconsMap = ref.watch(platformsImageProvider);

    final int areaRuns = area.history.length;
    final AreaHistoryEntry? lastHistoryEntry = areaRuns == 0 ? null : area.history.last;
    final bool isLastRunOk = lastHistoryEntry?.status == 'ok';

    return RefreshIndicator(
      onRefresh: () async {
        await _refreshArea();
      },
      child: MainPageLayout(
        title: area.name,
        leading: AppbarButton(
          icon: Icons.arrow_back_ios_rounded,
          onTap: () {
            context.pop();
          }
        ),
        trailing: [
          PopupMenuButton<String>(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(15.0)
            ),
            itemBuilder: (_) => [
              const PopupMenuItem(
                value: 'logs',
                child: PopupMenuSingleItem(
                  text: 'Show logs',
                  icon: Icons.list,
                )
              ),
              const PopupMenuDivider(),
              const PopupMenuItem(
                value: 'delete',
                child: PopupMenuSingleItem(
                  text: 'Delete AREA',
                  icon: Icons.delete_rounded,
                )
              )
            ],
            onSelected: (String? value) async {
              switch (value) {
                case 'logs':
                  context.pushNamed(
                    'logs',
                    extra: area
                  );
                  break;
                case 'delete':
                  setState(() {
                    _isLoading = true;
                  });

                  final areaNotifier = await ref.watch(areaNotifierProvider(widget.user).future);
                  final response = await areaNotifier.deleteArea(area.uuid!);

                  setState(() {
                    _isLoading = false;
                  });

                  if (response != null) {
                    if (context.mounted) {
                      ErrorDialog.show(
                        context: context,
                        error: response
                      );
                    }
                  } else {
                    if (context.mounted) {
                      context.pop();
                    }
                  }
                  break;
                default:
                  break;
              }
            },
            child: AppbarPopupMenuButton(),
          )
        ],
        children: [
          if (_isLoading) ... {
            CircularProgressIndicator()
          },
          AreactionCard(
            title: area.trigger.name,
            subtitle: area.actionPlatform.name,
            icon: iconsMap[area.actionPlatform.name.toLowerCase()],
          ),
          WhenThenDo(),
          AreactionCard(
            title: area.action.name,
            subtitle: area.reactionPlatform.name,
            icon: iconsMap[area.reactionPlatform.name.toLowerCase()],
          ),
          ClickableFrame(
            padding: const EdgeInsets.symmetric(vertical: 10),
            color: area.isEnabled ? Colors.red : Colors.green,
            onTap: () async {
              setState(() {
                _isLoading = true;
              });

              final repo = await ref.watch(areaRepositoryProvider.future);

              if (area.isEnabled) {
                await repo.disableArea(user: widget.user, areaUuid: area.uuid!);
              } else {
                await repo.enableArea(user: widget.user, areaUuid: area.uuid!);
              }

              await _refreshArea();

              setState(() {
                _isLoading = false;
              });
            },
            child: Center(
              child: Text(
                area.isEnabled ? 'Disable' : 'Enable',
                style: textTheme.titleMedium?.copyWith(
                  color: Colors.white,
                  fontSize: 20
                ),
              ),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                spacing: 5,
                children: [
                  Text(
                    'Created on:',
                    style: textTheme.bodyLarge?.copyWith(
                      fontWeight: FontWeight.w500
                    )
                  ),
                  Text(
                    area.createdAt != null
                      ? Utils.formatDate(area.createdAt!)
                      : 'Unknown',
                    style: textTheme.bodyLarge,
                  )
                ],
              ),
              Row(
                spacing: 5,
                children: [
                  Text(
                    'Last run:',
                    style: textTheme.bodyLarge?.copyWith(
                      fontWeight: FontWeight.w500
                    )
                  ),
                  if (areaRuns > 0) ... {
                    Icon(
                      isLastRunOk
                        ? Icons.check
                        : Icons.close_rounded,
                      color: isLastRunOk
                        ? Colors.green
                        : Colors.red,
                    ),
                  },
                  Text(
                    areaRuns == 0
                      ? '--'
                      : Utils.formatDate(lastHistoryEntry!.timestamp),
                    style: textTheme.bodyLarge,
                  )
                ],
              ),
              Text(
                'Ran ${areaRuns} time${areaRuns == 1 ? '' : 's'}',
                style: textTheme.bodyLarge,
              )
            ],
          ),
          Text(
            'AREA UUID:\n${area.uuid}',
            style: textTheme.bodySmall?.copyWith(
              color: Colors.grey.shade400,
              fontWeight: FontWeight.w300
            ),
            textAlign: TextAlign.center,
          )
        ]
      ),
    );
  }

}
