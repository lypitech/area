import 'package:area/data/provider/area_modal_provider.dart';
import 'package:area/model/platform_model.dart';
import 'package:area/widget/clickable_frame.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gap/gap.dart';

class PlatformCard extends ConsumerWidget {

  final PlatformModel platform;
  final int available;
  final VoidCallback? onTap;

  const PlatformCard({
    required this.platform,
    this.available = 0,
    this.onTap,
    super.key
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final textTheme = Theme.of(context).textTheme;

    return ClickableFrame(
      padding: const EdgeInsets.all(20),
      onTap: onTap,
      child: Stack(
        children: [
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                height: 48,
                width: 48,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                ),
                child: Placeholder(), // TODO: Put platform icon
              ),
              Gap(5),
              Text(
                platform.name,
                style: textTheme.titleMedium?.copyWith(
                    fontSize: 20
                ),
              ),
              Text(
                '$available available',
                style: textTheme.bodyMedium,
              )
            ],
          ),
          Positioned(
            top: 0,
            right: 0,
            child: Icon(
              Icons.person_off_rounded,
              color: Colors.red,
              size: 20,
            )
          )
        ],
      )
    );
  }

}
