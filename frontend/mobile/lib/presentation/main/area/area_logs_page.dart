import 'package:area/layout/main_page_layout.dart';
import 'package:area/model/area_model.dart';
import 'package:area/widget/appbar_button.dart';
import 'package:area/widget/log_card.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class AreaLogsPage extends StatelessWidget {

  final AreaModel area;

  const AreaLogsPage({
    required this.area,
    super.key
  });

  @override
  Widget build(BuildContext context) {
    final logs = area.history;
    final textTheme = Theme.of(context).textTheme;

    int counter = 0;

    return MainPageLayout(
      title: '${area.name} ‒ Logs',
      leading: AppbarButton(
        icon: Icons.arrow_back_ios_rounded,
        onTap: () => context.pop()
      ),
      children: [
        Divider(
          color: Colors.grey.shade400,
        ),
        logs.isEmpty
          ? Text(
            'This AREA has no log registered for now, since it never ran.',
            style: textTheme.titleMedium,
            textAlign: TextAlign.center,
          )
          : Column(
          spacing: 10,
            children: logs.map((e) {
              counter++;
              return LogCard(
                counter: counter,
                log: e
              );
            }).toList(),
          )
      ]
    );
  }

}
