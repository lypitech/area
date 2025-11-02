import 'package:area/core/constant/regexes.dart';
import 'package:area/data/provider/register_modal_provider.dart';
import 'package:area/data/provider/registration_provider.dart';
import 'package:area/l10n/app_localizations.dart';
import 'package:area/layout/register_page_layout.dart';
import 'package:area/presentation/dialog/error_dialog.dart';
import 'package:area/widget/a_text_field.dart';
import 'package:area/widget/field_validator.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gap/gap.dart';
import 'package:go_router/go_router.dart';

class RegisterPageStep3 extends ConsumerStatefulWidget {

  const RegisterPageStep3({
    super.key
  });

  @override
  ConsumerState<RegisterPageStep3> createState() => _RegisterPage3State();

}

class _RegisterPage3State extends ConsumerState<RegisterPageStep3> {

  final _formKey = GlobalKey<FormState>();

  final _passwordFieldController = TextEditingController();
  final _passwordConfirmationFieldController = TextEditingController();

  bool _onConfirm() {
    ref.read(registerModalProvider.notifier).update((state) {
      state.password = _passwordConfirmationFieldController.text;
      state.currentPage++;
      return state;
    });
    return true;
  }

  @override
  void dispose() {
    _passwordFieldController.dispose();
    _passwordConfirmationFieldController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return RegisterPageLayout(
      title: l10n.register_page_3_title,
      formKey: _formKey,
      onConfirm: _onConfirm,
      children: [
        ATextField(
          title: l10n.password,
          leadingIcon: Icons.lock_rounded,
          obscureToggle: true,
          controller: _passwordFieldController,
          validator: (String? value) {
            if (value == null || value.isEmpty) {
              return l10n.validator_empty_password;
            }
            if (!Regexes.password.hasMatch(value)) {
              return l10n.validator_invalid_password;
            }
            return null;
          },
          onChange: (_) => setState(() {}),
        ),
        Gap(20),
        ATextField(
          title: l10n.password_confirmation,
          leadingIcon: Icons.lock_rounded,
          obscureToggle: true,
          controller: _passwordConfirmationFieldController,
          validator: (String? value) {
            if (value == null || value.isEmpty) {
              return l10n.validator_empty_password;
            }
            if (value != _passwordFieldController.text) {
              return l10n.validator_not_matching_password;
            }
            return null;
          },
          onChange: (_) => setState(() {}),
        ),
        Gap(20),
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: [
                FieldValidator(
                  title: l10n.validator_password_8_chars_min,
                  rule: Regexes.eightCharactersMinimum,
                  strToTest: _passwordFieldController.text
                ),
                FieldValidator(
                  title: l10n.validator_password_capital_letter,
                  rule: Regexes.oneCapitalizedLetter,
                  strToTest: _passwordFieldController.text
                ),
                FieldValidator(
                  title: l10n.validator_password_small_letter,
                  rule: Regexes.oneNonCapitalizedLetter,
                  strToTest: _passwordFieldController.text
                ),
                FieldValidator(
                  title: l10n.validator_password_special_char,
                  rule: Regexes.oneSpecialCharacter,
                  strToTest: _passwordFieldController.text
                ),
              ],
            ),
          ],
        ),
      ],
    );
  }

}
