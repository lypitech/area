import 'package:area/core/constant/limits.dart';
import 'package:area/core/constant/regexes.dart';
import 'package:area/data/provider/register_modal_provider.dart';
import 'package:area/l10n/app_localizations.dart';
import 'package:area/layout/register_page_layout.dart';
import 'package:area/widget/a_text_field.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gap/gap.dart';

class RegisterPageStep1 extends ConsumerStatefulWidget {

  const RegisterPageStep1({
    super.key
  });

  @override
  ConsumerState<RegisterPageStep1> createState() => _RegisterPage1State();

}

class _RegisterPage1State extends ConsumerState<RegisterPageStep1> {

  final _formKey = GlobalKey<FormState>();

  final _nicknameFieldController = TextEditingController();
  final _usernameFieldController = TextEditingController();

  bool _onConfirm() {
    ref.read(registerModalProvider.notifier).update((state) {
      state.nickname = _nicknameFieldController.text;
      state.username = _usernameFieldController.text;
      state.currentPage++;
      return state;
    });
    return true;
  }

  @override
  void initState() {
    final registerModal = ref.read(registerModalProvider);

    _nicknameFieldController.text = registerModal.nickname;
    _usernameFieldController.text = registerModal.username;
    super.initState();
  }

  @override
  void dispose() {
    _nicknameFieldController.dispose();
    _usernameFieldController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return RegisterPageLayout(
      title: l10n.register_page_1_title,
      formKey: _formKey,
      onConfirm: _onConfirm,
      children: [
        ATextField(
          title: l10n.nickname,
          leadingIcon: Icons.person_rounded,
          maxLength: Limits.maxNicknameLength,
          controller: _nicknameFieldController,
          validator: (String? value) {
            if (value == null || value.isEmpty) {
              return l10n.validator_empty_nickname;
            }
            return null;
          },
        ),
        Gap(20),
        ATextField(
          title: l10n.username,
          leadingIcon: Icons.alternate_email_rounded,
          maxLength: Limits.maxUsernameLength,
          controller: _usernameFieldController,
          validator: (String? value) {
            if (value == null || value.isEmpty) {
              return l10n.validator_empty_username;
            }
            if (!Regexes.username.hasMatch(value)) {
              return l10n.validator_username_requirements;
            }
            return null;
          },
        ),
      ],
    );
  }

}
