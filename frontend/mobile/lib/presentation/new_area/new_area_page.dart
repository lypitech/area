import 'package:area/data/provider/area_modal_provider.dart';
import 'package:area/layout/main_page_layout.dart';
import 'package:area/widget/appbar_button.dart';
import 'package:area/widget/areaction_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class NewAreaPage extends ConsumerWidget {

  const NewAreaPage({
    super.key
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final textTheme = Theme.of(context).textTheme;
    final areaModal = ref.watch(areaModalProvider);

    return MainPageLayout(
      title: 'New AREA',
      leading: AppbarButton(
        icon: Icons.arrow_back_ios_rounded,
        onTap: () {
          context.pop();
        }
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // todo: Create AREA
        },
        label: Text(
          'Create',
          style: textTheme.titleLarge?.copyWith(
            color: Colors.white,
            fontWeight: FontWeight.w600
          ),
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      children: [
        AreactionCard(
          title: areaModal.trigger != null
            ? areaModal.trigger!.name
            : 'Choose a trigger',
          subtitle: areaModal.actionPlatform != null
            ? '${areaModal.actionPlatform!.name} (${areaModal.actionPlatform!.uuid})'
            : 'Choose a platform',
          onTap: () {
            context.pushNamed('choose_platform', pathParameters: { 'mode': 'action' });
          }
        ),
        Column(
          spacing: 5,
          children: [
            Text(
              'When',
              style: textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w500
              ),
            ),
            RotatedBox(
              quarterTurns: 1,
              child: Icon(
                Icons.link,
                size: 32,
              ),
            ),
            Text(
              'Then',
              style: textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w500
              ),
            )
          ],
        ),
        AreactionCard(
          title: areaModal.action != null
            ? areaModal.action!.name
            : 'Choose an action',
          subtitle: areaModal.reactionPlatform != null
            ? '${areaModal.reactionPlatform!.name} (${areaModal.reactionPlatform!.uuid})'
            : 'Choose a platform',
          onTap: () {
            context.pushNamed('choose_platform', pathParameters: { 'mode': 'reaction' });
          }
        ),
      ]
    );
  }

}
