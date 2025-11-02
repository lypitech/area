import 'package:area/data/provider/auth_provider.dart';
import 'package:area/l10n/app_localizations.dart';
import 'package:area/layout/main_page_layout.dart';
import 'package:area/model/user_model.dart';
import 'package:area/widget/a_card.dart';
import 'package:area/widget/popup_menu_button.dart';
import 'package:area/widget/popup_menu_single_item.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gap/gap.dart';
import 'package:go_router/go_router.dart';

class ProfilePage extends ConsumerWidget {

  final UserModel user;

  const ProfilePage({
    super.key,
    required this.user,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final textTheme = Theme.of(context).textTheme;

    return MainPageLayout(
      trailing: [
        PopupMenuButton<String>(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15.0)
          ),
          itemBuilder: (_) => [
            const PopupMenuItem(
              value: 'edit_profile',
              child: PopupMenuSingleItem(
                text: 'Edit profile',
                icon: Icons.edit_rounded
              )
            ),
            const PopupMenuItem(
              value: 'settings',
              child: PopupMenuSingleItem(
                text: 'Settings',
                icon: Icons.settings_rounded
              )
            ),
            const PopupMenuDivider(),
            const PopupMenuItem(
              value: 'log_out',
              child: PopupMenuSingleItem(
                text: 'Log out',
                icon: Icons.logout_rounded,
              )
            )
          ],
          onSelected: (String? value) {
            switch (value) {
              case 'edit_profile':
                break;
              case 'settings':
                context.push(
                  '/settings',
                  extra: user
                );
                break;
              case 'log_out':
                authLogout(context, ref);
                break;
              default:
                break;
            }
          },
          child: AppbarPopupMenuButton(),
        )
      ],
      children: [
        Column(
          children: [
            ClipOval(
              child: SizedBox(
                height: 128,
                width: 128,
                child: user.profilePictureBase64
                  ?? Image.asset(
                    'assets/image/default_profile_picture.jpg',
                    fit: BoxFit.cover
                  ),
              ),
            ),
            Gap(10),
            Text(
              user.nickname,
              style: textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w600
              ),
            ),
            Gap(5),
            Text(
              user.username,
              style: textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w300,
                color: Colors.grey.shade400
              ),
            ),
          ],
        ),
        ACard(
          title: 'Informations',
          children: [
            Text("Email: ${user.email}")
          ],
        ),
        Text(
          'Account UUID:\n${user.uuid}',
          style: textTheme.bodySmall?.copyWith(
            color: Colors.grey.shade400,
            fontWeight: FontWeight.w300
          ),
          textAlign: TextAlign.center,
        )
      ],
    );
  }

}
