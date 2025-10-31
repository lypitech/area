import 'package:area/data/provider/auth_provider.dart';
import 'package:area/layout/main_page_layout.dart';
import 'package:area/model/settings_tile_model.dart';
import 'package:area/model/user_model.dart';
import 'package:area/widget/appbar_button.dart';
import 'package:area/widget/clickable_frame.dart';
import 'package:area/widget/settings_tile.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gap/gap.dart';
import 'package:go_router/go_router.dart';

class SettingsPage extends ConsumerWidget {

  final UserModel user;

  SettingsPage({
    super.key,
    required this.user
  });

  final List<SettingsTileModel> tiles = [
    SettingsTileModel(
      icon: Icons.link_rounded,
      color: const Color.fromRGBO(189, 171, 218, 1),
      title: 'Linked accounts',
      route: 'link'
    ),
    SettingsTileModel(
      icon: Icons.info_rounded,
      color: Color.fromRGBO(183, 98, 193, 1),
      title: 'About',
      route: 'about'
    )
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MainPageLayout(
      title: 'Settings',
      leading: AppbarButton(
        icon: Icons.arrow_back_ios_rounded,
        onTap: () => context.pop()
      ),
      children: [
        Column(
          spacing: 5,
          children: [
            for (SettingsTileModel tile in tiles) ... {
              SettingsTile(
                title: tile.title,
                iconBackgroundColor: tile.color,
                icon: tile.icon,
                onTap: () {
                  context.push('/settings/${tile.route}');
                },
              ),
            }
          ],
        ),
        Divider(
          color: Colors.grey.shade300,
        ),
        ClickableFrame(
          color: Colors.red,
          onTap: () => authLogout(context, ref),
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 15),
          child: Center(
            child: Text(
              'Log out',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                color: Colors.white
              ),
            )
          )
        )
      ]
    );
  }

}
