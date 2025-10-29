import 'package:area/model/area_model.dart';
import 'package:area/widget/clickable_frame.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class AreaCard extends StatelessWidget {

  final AreaModel area;

  const AreaCard({
    required this.area,
    super.key
  });

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return ClickableFrame(
      onTap: () {
        context.pushNamed(
          'area_details',
          extra: area
        );
      },
      padding: const EdgeInsets.all(20),
      child: Column(
        spacing: 10,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            spacing: 5,
            children: [
              SizedBox(
                height: 24,
                width: 24,
                child: Placeholder(),
              ),
              Icon(Icons.link_rounded),
              SizedBox(
                height: 24,
                width: 24,
                child: Placeholder(),
              )
            ],
          ),
          Text(
            area.name,
            style: textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w500
            ),
          )
        ],
      )
    );
  }

}
