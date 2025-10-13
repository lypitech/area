import 'package:area/data/provider/areas_provider.dart';
import 'package:area/data/provider/auth_provider.dart';
import 'package:area/l10n/app_localizations.dart';
import 'package:area/layout/main_page_layout.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class ProfilePage extends ConsumerWidget {

  const ProfilePage({
    super.key
  });

  void _logout(BuildContext context, WidgetRef ref) async {
    final authNotifier = ref.read(authNotifierProvider.notifier);

    await authNotifier.logout();
    if (context.mounted) {
      context.go('/login');
    }
    ref.read(areasProvider).clear();
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final user = ref.watch(authNotifierProvider.notifier).getUser()!;

    return MainPageLayout(
      title: l10n.profile_page_title,
      children: [
        Text("Username: ${user.username}"),
        Text("Nickname: ${user.nickname}"),
        Text("Email: ${user.email}"),
        Text("UUID: ${user.uuid}"),
        ElevatedButton(
          onPressed: () async => _logout(context, ref),
          child: Text('Log out')
        )
      ],
    );
  }

}
