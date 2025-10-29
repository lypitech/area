import 'package:area/core/oauth/oauth_github.dart';
import 'package:area/data/provider/areas_provider.dart';
import 'package:area/data/provider/auth_provider.dart';
import 'package:area/l10n/app_localizations.dart';
import 'package:area/layout/main_page_layout.dart';
import 'package:area/model/user_model.dart';
import 'package:area/presentation/dialog/app_settings_dialog.dart';
import 'package:area/widget/a_card.dart';
import 'package:area/widget/appbar_button.dart';
import 'package:area/widget/clickable_frame.dart';
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

  void _logout(BuildContext context, WidgetRef ref) async {
    final authNotifier = await ref.read(authNotifierProvider.future);

    await authNotifier.logout();
    if (context.mounted) {
      context.go('/login');
    }
    ref.read(areasProvider).clear();
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final textTheme = Theme.of(context).textTheme;

    return MainPageLayout(
      leading: AppbarButton(
        icon: Icons.settings,
        onTap: () => AppSettingsDialog.show(context, ref)
      ),
      children: [
        Column(
          children: [
            Container(
              height: 128,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                image: DecorationImage(
                  fit: BoxFit.contain,
                  image: AssetImage('assets/image/default_profile_picture.jpg')
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
            Gap(10),
            ClickableFrame(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              onTap: () {
                // ...
              },
              child: Text('Edit profile')
            ),
          ],
        ),
        ACard(
          title: 'Informations',
          children: [
            Text("Email: ${user.email}")
          ],
        ),
        ACard(
          title: 'Services',
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Github'),
                ElevatedButton(
                  onPressed: () async {
                    final code = await githubSignIn();

                    if (code == null) {
                      return;
                    }
                    // push to api lol
                  },
                  child: Text('Login')
                )
              ],
            )
          ],
        ),
        ClickableFrame(
          color: Colors.red,
          onTap: () async => _logout(context, ref),
          padding: const EdgeInsets.symmetric(vertical: 15, horizontal: 20),
          child: Center(
            child: Text(
              'Log out',
              style: textTheme.titleMedium?.copyWith(
                  color: Colors.white
              ),
            ),
          ),
        ),
        Text(
          'Account UUID:\n${user.uuid}',
          style: textTheme.bodyMedium?.copyWith(
            color: Colors.grey.shade400
          ),
          textAlign: TextAlign.center,
        )
      ],
    );
  }

}
