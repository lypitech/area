import 'dart:convert';

import 'package:area/model/platform_model.dart';
import 'package:area/model/user_model.dart';
import 'package:area/widget/a_popup.dart';
import 'package:area/widget/clickable_frame.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gap/gap.dart';
import 'package:go_router/go_router.dart';

class PlatformCard extends ConsumerWidget {

  final UserModel user;
  final PlatformModel platform;
  final int available;
  final VoidCallback? onTap;

  const PlatformCard({
    required this.user,
    required this.platform,
    this.available = 0,
    this.onTap,
    super.key
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final textTheme = Theme.of(context).textTheme;
    final isLoggedIn = user.oauthUuids.containsKey(platform.name.toLowerCase());

    return ClickableFrame(
      padding: const EdgeInsets.all(20),
      onTap: () {
        if (onTap == null) {
          return;
        }

        if (isLoggedIn) {
          onTap!();
          return;
        }

        showDialog(
          context: context,
          builder: (_) {
            return APopup(
              title: 'Caution',
              icon: Icons.warning_amber_rounded,
              iconBackgroundColor: Colors.orange,
              content:
                'You have not linked your ${platform.name} account yet.\n'
                'You can do it by going to the settings page.',
              confirmButtonTitle: 'Go to settings',
              onConfirm: () {
                context.go(
                  '/settings/link',
                  extra: user
                );
              },
            );
          }
        );
      },
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
                child: platform.icon
                  ?? Container(
                    decoration: BoxDecoration(
                      color: Colors.grey,
                      shape: BoxShape.circle
                    ),
                  ),
              ),
              Gap(10),
              Text(
                platform.name,
                style: textTheme.titleMedium?.copyWith(
                  fontSize: 20,
                  height: 1.2
                ),
              ),
              Gap(5),
              Text(
                '$available available',
                style: textTheme.bodyMedium,
              )
            ],
          ),
          if (!isLoggedIn) ... {
            Positioned(
              top: 0,
              right: 0,
              child: Icon(
                Icons.person_off_rounded,
                color: Colors.red,
                size: 20,
              )
            )
          }
        ],
      )
    );
  }

}
