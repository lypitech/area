import 'package:area/data/provider/register_modal_provider.dart';
import 'package:area/presentation/auth/registration/step/register_page_step_1.dart';
import 'package:area/presentation/auth/registration/step/register_page_step_2.dart';
import 'package:area/presentation/auth/registration/step/register_page_step_3.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class RegisterPage extends ConsumerWidget {

  const RegisterPage({
    super.key
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final registerModal = ref.watch(registerModalProvider);

    return switch (registerModal.currentPage) {
      0 => RegisterPageStep1(),
      1 => RegisterPageStep2(),
      2 => RegisterPageStep3(),
      3 => RegisterPageStep1(),
      4 => RegisterPageStep1(),
      int() => throw UnimplementedError(),
    };
  }

}
