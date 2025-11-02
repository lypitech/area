import 'package:area/core/constant/constants.dart';
import 'package:area/core/constant/regexes.dart';
import 'package:area/core/oauth/oauth_github.dart';
import 'package:area/data/provider/auth_provider.dart';
import 'package:area/data/provider/platforms_icons_provider.dart';
import 'package:area/data/provider/register_modal_provider.dart';
import 'package:area/modal/register_modal.dart';
import 'package:area/presentation/dialog/app_settings_dialog.dart';
import 'package:area/presentation/dialog/error_dialog.dart';
import 'package:area/widget/a_text_field.dart';
import 'package:area/widget/clickable_frame.dart';
import 'package:area/widget/logo.dart';
import 'package:area/l10n/app_localizations.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gap/gap.dart';
import 'package:go_router/go_router.dart';

class LoginPage extends ConsumerStatefulWidget {

  const LoginPage({
    super.key
  });

  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();

}

class _LoginPageState extends ConsumerState<LoginPage> {

  bool _isLoading = false;
  final _authFormKey = GlobalKey<FormState>();

  final _emailFieldController = TextEditingController();
  final _passwordFieldController = TextEditingController();

  Future<void> _login(BuildContext context, WidgetRef ref) async {
    if (_authFormKey.currentState != null &&
        !_authFormKey.currentState!.validate()) {
      return;
    }

    try {
      final authNotifier = await ref.watch(authNotifierProvider.future);

      await authNotifier.login(
        email: _emailFieldController.text,
        password: _passwordFieldController.text
      );

      if (context.mounted) {
        context.go('/');
      }
    } catch (e) {
      // Login failed for some reasons.
      if (context.mounted) {
        ErrorDialog.show(
          context: context,
          error: '$e'
        );
      }
    }
  }

  Future<void> _githubLogin(BuildContext context, WidgetRef ref) async {
    // ...
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final textTheme = Theme.of(context).textTheme;
    final imageMap = ref.watch(platformsImageProvider);

    return Form(
      key: _authFormKey,
      child: Scaffold(
        body: Stack(
          children: [
            Positioned.fill(
              child: Padding(
                padding: const EdgeInsetsGeometry.all(20),
                child: Center(
                  child: SingleChildScrollView(
                    child: Flex(
                      direction: Axis.vertical,
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Logo(),
                        Gap(10),
                        Text(
                          Constants.appName,
                          style: textTheme.displayMedium?.copyWith(
                            fontWeight: FontWeight.w700
                          ),
                        ),
                        Gap(40),
                        ATextField(
                          title: l10n.email,
                          hintText: 'john.doe@example.com',
                          leadingIcon: Icons.email_rounded,
                          keyboardType: TextInputType.emailAddress,
                          controller: _emailFieldController,
                          validator: (String? value) {
                            if (value == null || value.isEmpty) {
                              return l10n.validator_empty_email;
                            }
                            if (!Regexes.email.hasMatch(value)) {
                              return l10n.validator_invalid_email;
                            }
                            return null;
                          },
                        ),
                        Gap(20),
                        ATextField(
                          title: l10n.password,
                          leadingIcon: Icons.lock_rounded,
                          obscureToggle: true,
                          keyboardType: TextInputType.visiblePassword,
                          controller: _passwordFieldController,
                          validator: (String? value) {
                            if (value == null || value.isEmpty) {
                              return l10n.validator_empty_password;
                            }
                            return null;
                          },
                        ),
                        /// Keeping this just in case, but this is gonna gonna be done.
                        // Row(
                        //   mainAxisAlignment: MainAxisAlignment.end,
                        //   children: [
                        //     TextButton(
                        //       onPressed: () {
                        //         // ...
                        //       },
                        //       child: Text(
                        //         l10n.forgot_password,
                        //         textAlign: TextAlign.right,
                        //         style: textTheme.bodyMedium?.copyWith(
                        //           decoration: TextDecoration.underline
                        //         ),
                        //       )
                        //     )
                        //   ],
                        // ),
                        Gap(40),
                        ClickableFrame(
                          onTap: () async {
                            setState(() {
                              _isLoading = true;
                            });

                            await _login(context, ref);

                            setState(() {
                              _isLoading = false;
                            });
                          },
                          child: Padding(
                            padding: const EdgeInsets.all(20),
                            child: Container(
                              width: 24,
                              height: 24,
                              child: _isLoading
                                ? CircularProgressIndicator()
                                : Icon(Icons.arrow_forward_ios_rounded),
                            ),
                          ),
                        ),
                        Gap(40),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          spacing: 7.5,
                          children: [
                            Container(
                              width: 30,
                              height: 2,
                              color: Colors.black,
                            ),
                            Text(
                              l10n.or_continue_with,
                              style: textTheme.titleSmall,
                            ),
                            Container(
                              width: 30,
                              height: 2,
                              color: Colors.black,
                            )
                          ],
                        ),
                        Gap(20),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          spacing: 20,
                          children: [
                            ClickableFrame(
                              padding: const EdgeInsets.all(10),
                              onTap: () async {
                                setState(() {
                                  _isLoading = true;
                                });

                                await _githubLogin(context, ref);

                                setState(() {
                                  _isLoading = false;
                                });
                              },
                              child: Row(
                                spacing: 5,
                                children: [
                                  Container(
                                    width: 28,
                                    height: 28,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle
                                    ),
                                    child: imageMap['github'] ?? Container(color: Colors.grey),
                                  ),
                                  Text(
                                    'Login with Github',
                                    style: textTheme.titleMedium?.copyWith(
                                      height: 1.1
                                    ),
                                  )
                                ],
                              )
                            ),
                          ],
                        ),
                        Gap(20),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            Text(
                              l10n.register_prompt,
                              style: textTheme.titleSmall?.copyWith(
                                  fontWeight: FontWeight.w300
                              ),
                            ),
                            TextButton(
                                onPressed: () {
                                  ref.read(registerModalProvider.notifier).update((_) {
                                    return RegisterModal();
                                  });
                                  context.push('/register');
                                },
                                child: Text(
                                  l10n.sign_up,
                                  style: textTheme.titleSmall,
                                )
                            )
                          ],
                        )
                      ],
                    ),
                  ),
                ),
              )
            ),
            Positioned(
              top: 40,
              left: 20,
              child: ClickableFrame(
                padding: const EdgeInsets.all(10),
                onTap: () => AppSettingsDialog.show(context, ref),
                child: Icon(Icons.settings)
              ),
            ),
          ],
        ),
      ),
    );
  }

}
