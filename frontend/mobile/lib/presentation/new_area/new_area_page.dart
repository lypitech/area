import 'package:area/data/provider/area_modal_provider.dart';
import 'package:area/layout/main_page_layout.dart';
import 'package:area/widget/appbar_button.dart';
import 'package:area/widget/clickable_frame.dart';
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
      children: [
        ClickableFrame(
          padding: const EdgeInsets.all(20),
          child: Placeholder(
            fallbackHeight: 50,
          ),
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
              '... then do',
              style: textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w500
              ),
            )
          ],
        ),
      ]
    );
  }

}
