import 'package:area/core/constant/limits.dart';
import 'package:area/core/constant/regexes.dart';
import 'package:area/data/provider/register_modal_provider.dart';
import 'package:area/l10n/app_localizations.dart';
import 'package:area/layout/register_page_layout.dart';
import 'package:area/widget/a_text_field.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gap/gap.dart';

class RegisterPageStep2 extends ConsumerStatefulWidget {

  const RegisterPageStep2({
    super.key
  });

  @override
  ConsumerState<RegisterPageStep2> createState() => _RegisterPage2State();

}

class _RegisterPage2State extends ConsumerState<RegisterPageStep2> {

  final _formKey = GlobalKey<FormState>();

  final _emailFieldController = TextEditingController();

  bool _onConfirm() {
    final registerModal = ref.read(registerModalProvider);

    registerModal.emailAddress = _emailFieldController.text;
    registerModal.currentPage++;
    return true;
  }

  @override
  void initState() {
    final registerModal = ref.read(registerModalProvider);

    _emailFieldController.text = registerModal.emailAddress;
    super.initState();
  }

  @override
  void dispose() {
    _emailFieldController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final registerModal = ref.watch(registerModalProvider);
    final l10n = AppLocalizations.of(context)!;

    return RegisterPageLayout(
      title: l10n.register_page_2_title(registerModal.nickname),
      formKey: _formKey,
      onConfirm: _onConfirm,
      children: [
        ATextField(
          title: l10n.email,
          leadingIcon: Icons.email_rounded,
          maxLength: Limits.maxNicknameLength,
          controller: _emailFieldController,
          validator: (String? value) {
            if (value == null || value.isEmpty) {
              return 'Please specify an email.';
            }
            if (!Regexes.email.hasMatch(value)) {
              return 'Please specify a valid email address.';
            }
            return null;
          },
        ),
      ],
    );
  }

}
