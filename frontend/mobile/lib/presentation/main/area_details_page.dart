import 'package:area/layout/main_page_layout.dart';
import 'package:area/model/area_model.dart';
import 'package:area/widget/appbar_button.dart';
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
    return MainPageLayout(
      title: area.title,
      leading: AppbarButton(
        icon: Icons.arrow_back_ios_rounded,
        onTap: () {
          context.pop();
        }
      ),
      children: [
        Text(
          area.actionPlatform.name
        ),
        Text(
          area.trigger.name
        ),
        Text(
          area.reactionPlatform.name
        ),
        Text(
          area.action.name
        ),
        ElevatedButton(
          onPressed: () {
            // ...
          },
          child: Text('Disable')
        ),
        Text(
          'AREA UUID: ...'
        )
      ]
    );
  }

}
