import 'package:area/layout/main_page_layout.dart';
import 'package:area/model/area_model.dart';
import 'package:area/widget/appbar_button.dart';
import 'package:area/widget/areaction_card.dart';
import 'package:area/widget/clickable_frame.dart';
import 'package:area/widget/when_then_do.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class AreaDetailsPage extends StatelessWidget {

  final AreaModel area;

  const AreaDetailsPage({
    required this.area,
    super.key
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final textTheme = theme.textTheme;

    return MainPageLayout(
      title: area.title,
      leading: AppbarButton(
        icon: Icons.arrow_back_ios_rounded,
        onTap: () {
          context.pop();
        }
      ),
      children: [
        AreactionCard(
          title: area.trigger.name,
          subtitle: area.actionPlatform.name,
        ),
        WhenThenDo(),
        AreactionCard(
          title: area.action.name,
          subtitle: area.reactionPlatform.name,
        ),
        ClickableFrame(
          padding: const EdgeInsets.symmetric(vertical: 10),
          color: Colors.red,
          onTap: () {
            // ...
          },
          child: Center(
            child: Text(
              'Disable',
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
                  'Created on: ',
                  style: textTheme.bodyLarge?.copyWith(
                    fontWeight: FontWeight.w500
                  )
                ),
                Text(
                  '...',
                  style: textTheme.bodyLarge,
                )
              ],
            ),
            Row(
              spacing: 5,
              children: [
                Text(
                  'Last run: ',
                  style: textTheme.bodyLarge?.copyWith(
                    fontWeight: FontWeight.w500
                  )
                ),
                Icon(Icons.check),
                Text(
                  '...',
                  style: textTheme.bodyLarge,
                )
              ],
            ),
            Text(
              'Ran ... times',
              style: textTheme.bodyLarge,
            )
          ],
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          spacing: 20,
          children: [
            ClickableFrame(
              color: theme.colorScheme.primary,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              onTap: () {
                // ...
              },
              child: Text(
                'Publish',
                style: textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.w500,
                  color: Colors.white
                ),
              )
            ),
            ClickableFrame(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              onTap: () {
                // ...
              },
              child: Text(
                'Archive',
                style: textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.w500,
                ),
              )
            ),
            ClickableFrame(
              color: Colors.red,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              onTap: () {
                // ...
              },
              child: Text(
                'Delete',
                style: textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.w500,
                  color: Colors.white
                ),
              )
            )
          ],
        ),
        Text(
          'AREA UUID: ...',
          style: textTheme.bodyMedium?.copyWith(
            color: Colors.grey.shade400
          ),
          textAlign: TextAlign.center,
        )
      ]
    );
  }

}
