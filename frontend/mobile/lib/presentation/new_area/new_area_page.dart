import 'package:area/data/provider/area_modal_provider.dart';
import 'package:area/data/provider/areas_provider.dart';
import 'package:area/l10n/app_localizations.dart';
import 'package:area/layout/main_page_layout.dart';
import 'package:area/model/area_model.dart';
import 'package:area/widget/a_text_field.dart';
import 'package:area/widget/appbar_button.dart';
import 'package:area/widget/areaction_card.dart';
import 'package:area/widget/when_then_do.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:go_router/go_router.dart';

class NewAreaPage extends ConsumerStatefulWidget {

  const NewAreaPage({
    super.key
  });

  @override
  ConsumerState<NewAreaPage> createState() => _NewAreaPageState();

}

class _NewAreaPageState extends ConsumerState<NewAreaPage> {

  final _titleController = TextEditingController();

  @override
  void initState() {
    _titleController.text = ref.read(areaModalProvider).title ?? '';
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    final areaModal = ref.watch(areaModalProvider);
    final l10n = AppLocalizations.of(context)!;

    return MainPageLayout(
      title: l10n.new_area_title,
      leading: AppbarButton(
        icon: Icons.arrow_back_ios_rounded,
        onTap: () {
          context.pop();
        }
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          ref.read(areaModalProvider.notifier).setTitle(_titleController.text);
          if (!areaModal.isComplete()) {
            // fixme: tmp
            showDialog(
              context: context,
              builder: (_) {
                return AlertDialog(
                  title: Text('Please fill everything up.'),
                  content: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('or consequences')
                    ]
                  ),
                  actions: [
                    ElevatedButton(
                      onPressed: () {
                        context.pop();
                      },
                      child: Text('OK')
                    )
                  ],
                );
              }
            );
            return;
          }

          final area = AreaModel.fromModal(areaModal);

          ref.read(areasProvider).add(area);

          Fluttertoast.showToast(msg: 'Successfully created AREA');
          context.pop();
        },
        label: Text(
          l10n.create_area,
          style: textTheme.titleLarge?.copyWith(
            color: Colors.white,
            fontWeight: FontWeight.w600
          ),
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      children: [
        ATextField(
          title: 'Title',
          controller: _titleController,
          onChange: (String? value) {
            ref.read(areaModalProvider.notifier).setTitle(value);
          },
        ),
        AreactionCard(
          title: areaModal.trigger != null
            ? areaModal.trigger!.name
            : l10n.choose_trigger,
          subtitle: areaModal.actionPlatform != null
            ? '${areaModal.actionPlatform!.name} (${areaModal.actionPlatform!.uuid})'
            : l10n.choose_platform,
          onTap: () {
            context.pushNamed('choose_platform', pathParameters: { 'mode': 'action' });
          }
        ),
        WhenThenDo(),
        AreactionCard(
          title: areaModal.action != null
            ? areaModal.action!.name
            : l10n.choose_action,
          subtitle: areaModal.reactionPlatform != null
            ? '${areaModal.reactionPlatform!.name} (${areaModal.reactionPlatform!.uuid})'
            : l10n.choose_platform,
          onTap: () {
            context.pushNamed('choose_platform', pathParameters: { 'mode': 'reaction' });
          }
        ),
      ]
    );
  }

}
