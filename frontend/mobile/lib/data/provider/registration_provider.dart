import 'package:area/data/provider/auth_provider.dart';
import 'package:area/data/provider/register_modal_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';

class RegistrationNotifier extends StateNotifier<AsyncValue<void>> {

  final Ref ref;

  RegistrationNotifier(this.ref) : super(const AsyncValue.data(null));

  Future<void> register() async {
    final registerModal = ref.read(registerModalProvider);
    final authNotifier = await ref.read(authNotifierProvider.future);

    state = const AsyncValue.loading();

    try {
      await authNotifier.register(
        email: registerModal.emailAddress,
        password: registerModal.password,
        nickname: registerModal.nickname,
        username: registerModal.username,
      );
      state = const AsyncValue.data(null);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
      rethrow;
    }
  }

}

final registrationNotifierProvider =
  StateNotifierProvider<RegistrationNotifier, AsyncValue<void>>((ref) {
    return RegistrationNotifier(ref);
  });
