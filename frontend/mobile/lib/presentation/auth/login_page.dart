import 'package:area/core/constant/constants.dart';
import 'package:area/widget/a_text_field.dart';
import 'package:area/widget/clickable_frame.dart';
import 'package:area/widget/logo.dart';
import 'package:area/l10n/app_localizations.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gap/gap.dart';
import 'package:go_router/go_router.dart';

class LoginPage extends ConsumerWidget {

  final _authFormKey = GlobalKey<FormState>();

  final _emailFieldController = TextEditingController();
  final _passwordFieldController = TextEditingController();

  LoginPage({
    super.key
  });

  void _login(WidgetRef ref) async {
    if (_authFormKey.currentState != null &&
        !_authFormKey.currentState!.validate()) {
      return;
    }

    // try {
    //   await ref.read(authServiceProvider).login(
    //     _emailFieldController.text,
    //     _passwordFieldController.text,
    //   );
    //   ref.read(authStateProvider.notifier).state = true;
    // } catch (e) {
    //   print(e);
    //   Fluttertoast.showToast(msg: 'Login failed: $e');
    // }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final textTheme = Theme.of(context).textTheme;

    return Form(
      key: _authFormKey,
      child: Scaffold(
        body: Padding(
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
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      TextButton(
                        onPressed: () {
                          // ...
                        },
                        child: Text(
                          l10n.forgot_password,
                          textAlign: TextAlign.right,
                          style: textTheme.bodyMedium?.copyWith(
                            decoration: TextDecoration.underline
                          ),
                        )
                      )
                    ],
                  ),
                  Gap(40),
                  ClickableFrame(
                    onTap: () => _login(context, ref),
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Icon(Icons.arrow_forward_ios_rounded),
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
                        child: Placeholder(
                          fallbackWidth: 56,
                          fallbackHeight: 56,
                        ),
                      ),
                      ClickableFrame(
                        child: Placeholder(
                          fallbackWidth: 56,
                          fallbackHeight: 56,
                        ),
                      ),
                      ClickableFrame(
                        child: Placeholder(
                          fallbackWidth: 56,
                          fallbackHeight: 56,
                        ),
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
        ),
      ),
    );
  }

}
