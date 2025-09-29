import 'package:area/modal/area_modal.dart';
import 'package:flutter_riverpod/legacy.dart';

final areaModalProvider = StateNotifierProvider<AreaModalNotifier, AreaModal>((ref) {
  return AreaModalNotifier();
});
