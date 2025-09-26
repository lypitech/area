import 'package:area/l10n/app_localizations.dart';
import 'package:area/layout/register_page_layout.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gap/gap.dart';

class RegisterPageStep4 extends ConsumerStatefulWidget {

  const RegisterPageStep4({
    super.key
  });

  @override
  ConsumerState<RegisterPageStep4> createState() => _RegisterPage4State();

}

class _RegisterPage4State extends ConsumerState<RegisterPageStep4> {

  bool _onConfirm() {
    // ...
    return false;
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return RegisterPageLayout(
      title: l10n.register_page_4_title,
      isStepSkippable: true,
      onConfirm: _onConfirm,
      children: [
        Container(
          height: 192,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            image: DecorationImage(
              fit: BoxFit.contain,
              image: AssetImage('assets/image/default_profile_picture.jpg')
            ),
          ),
        ),
        Gap(20),
        Placeholder(
          fallbackHeight: 48,
        ),
      ],
    );
  }

}
