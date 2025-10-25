import 'package:area/data/provider/auth_provider.dart';
import 'package:area/data/provider/register_modal_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final registrationProvider = FutureProvider<void>((ref) async {
  final registerModal = ref.read(registerModalProvider);
  final authNotifier = await ref.watch(authNotifierProvider.future);

  await authNotifier.register(
    email: registerModal.emailAddress,
    password: registerModal.password,
    nickname: registerModal.nickname,
    username: registerModal.username,
  );
});
