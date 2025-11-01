import 'dart:convert';

import 'package:area/data/provider/platforms_icons_provider.dart';
import 'package:area/model/area_model.dart';
import 'package:area/widget/clickable_frame.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class AreaCard extends ConsumerWidget {

  final AreaModel area;

  const AreaCard({
    required this.area,
    super.key
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final textTheme = Theme.of(context).textTheme;
    final iconsMap = ref.watch(platformsImageProvider);

    final Image? triggerPlatformIcon = iconsMap[area.actionPlatform.name.toLowerCase()];
    final Image? actionPlatformIcon = iconsMap[area.reactionPlatform.name.toLowerCase()];

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
              Container(
                height: 24,
                width: 24,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                ),
                child: triggerPlatformIcon
                  ?? Container(
                    decoration: BoxDecoration(
                      color: Colors.grey,
                      shape: BoxShape.circle
                    ),
                  ),
              ),
              Icon(Icons.link_rounded),
              Container(
                height: 24,
                width: 24,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                ),
                child: actionPlatformIcon
                  ?? Container(
                    decoration: BoxDecoration(
                      color: Colors.grey,
                      shape: BoxShape.circle
                    ),
                  ),
              ),
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
