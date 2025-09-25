import 'package:area/modal/register_modal.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final registerModalProvider = Provider<RegisterModal>((_) {
  return RegisterModal();
});
