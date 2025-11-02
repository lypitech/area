import 'package:area/modal/register_modal.dart';
import 'package:flutter_riverpod/legacy.dart';

final registerModalProvider = StateProvider<RegisterModal>((_) {
  return RegisterModal();
});
