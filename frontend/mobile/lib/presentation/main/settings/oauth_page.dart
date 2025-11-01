import 'package:area/core/oauth/oauth_github.dart';
import 'package:area/data/provider/auth_provider.dart';
import 'package:area/data/provider/oauth_provider.dart';
import 'package:area/layout/main_page_layout.dart';
import 'package:area/model/user_model.dart';
import 'package:area/presentation/dialog/error_dialog.dart';
import 'package:area/widget/appbar_button.dart';
import 'package:area/widget/areaction_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class OauthPage extends ConsumerWidget {

  final UserModel user;

  const OauthPage({
    super.key,
    required this.user
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MainPageLayout(
      title: 'Linked accounts',
      leading: AppbarButton(
        icon: Icons.arrow_back_ios_rounded,
        onTap: () => context.pop()
      ),
      children: [
        PlatformLoginCard(
          name: 'Github',
          user: user,
          loginLogic: () async {
            final oauthRepository = await ref.watch(oauthRepositoryProvider.future);
            final code = await githubSignIn();

            if (code.startsWith('AR3AERR:')) {
              if (context.mounted) {
                ErrorDialog.show(
                  context: context,
                  error: 'For some reasons, the link has failed.\n(${code.substring(8)})'
                );
              }
              return;
            }

            print("CODE: $code");

            try {
              await oauthRepository.githubLogin(
                userUuid: user.uuid,
                code: code
              );

              /* Basically reloading the user profile to update cache */
              final authNotifier = await ref.read(authNotifierProvider.future);
              await authNotifier.checkAuth();
            } catch (exception) {
              if (context.mounted) {
                ErrorDialog.show(
                  context: context,
                  error: 'For some reasons, the link has failed.\n($exception)'
                );
              }
            }
          }
        ),
        PlatformLoginCard(
          name: 'Twitch',
          user: user,
          loginLogic: () async {
            // ...
          }
        )
      ]
    );
  }

}

class PlatformLoginCard extends StatelessWidget {

  final String name;
  final UserModel user;
  final VoidCallback loginLogic;

  const PlatformLoginCard({
    super.key,
    required this.name,
    required this.user,
    required this.loginLogic
  });

  @override
  Widget build(BuildContext context) {
    final bool isLoggedIn = user.oauthUuids.containsKey(name.toLowerCase());

    return AreactionCard(
      title: name,
      subtitle: isLoggedIn ? 'Logged in' : 'Not logged in',
      onTap: isLoggedIn ? null : loginLogic,
    );
  }

}

