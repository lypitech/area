import 'package:area/data/provider/auth_provider.dart';
import 'package:area/layout/main_page_layout.dart';
import 'package:area/model/settings_tile_model.dart';
import 'package:area/model/user_model.dart';
import 'package:area/presentation/dialog/app_settings_dialog.dart';
import 'package:area/presentation/dialog/error_dialog.dart';
import 'package:area/widget/a_popup.dart';
import 'package:area/widget/appbar_button.dart';
import 'package:area/widget/clickable_frame.dart';
import 'package:area/widget/settings_tile.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
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
      icon: Icons.settings_rounded,
      color: Colors.grey,
      title: 'API settings',
      route: '\$api_settings'
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
    final textTheme = Theme.of(context).textTheme;

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
                  if (tile.route == '\$api_settings') { // only special case
                    AppSettingsDialog.show(context, ref);
                    return;
                  }

                  context.push(
                    '/settings/${tile.route}',
                    extra: user
                  );
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
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            spacing: 5,
            children: [
              Icon(
                Icons.logout_rounded,
                color: Colors.white,
              ),
              Text(
                'Log out',
                style: textTheme.titleMedium?.copyWith(
                  color: Colors.white
                ),
              )
            ],
          )
        ),
        Divider(
          color: Colors.grey.shade300,
        ),
        Text(
          '⚠️ Danger zone',
          style: textTheme.titleMedium?.copyWith(
            color: Colors.red,
            fontSize: 22
          ),
        ),
        ClickableFrame(
          color: Colors.red,
          onTap: () {
            showDialog(
              context: context,
              builder: (context1) {
                return APopup(
                  title: 'Account deletion',
                  icon: Icons.delete_rounded,
                  iconBackgroundColor: Colors.red,
                  content: 'Are you sure you want to delete your account?\nThis action cannot be undone!',
                  confirmButtonColor: Colors.red,
                  onConfirm: () async {
                    try {
                      final authNotifier = await ref.read(authNotifierProvider.future);
                      await authNotifier.deleteAccount();

                      if (context.mounted) {
                        context.pop();
                        context.go('/login');
                      }
                    } catch (e) {
                      if (context.mounted) {
                        ErrorDialog.show(
                          context: context,
                          error: 'There has been a problem while deleting your account.\n($e)'
                        );
                      }
                    }
                  },
                );
              }
            );
          },
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 15),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            spacing: 5,
            children: [
              Icon(
                Icons.delete_rounded,
                color: Colors.white,
              ),
              Text(
                'Delete your account',
                style: textTheme.titleMedium?.copyWith(
                  color: Colors.white
                ),
              )
            ]
          )
        ),
      ]
    );
  }

}
