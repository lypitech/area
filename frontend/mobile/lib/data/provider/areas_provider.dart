import 'package:area/model/area_model.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final areasProvider = Provider<List<AreaModel>>((ref) {
  return List.empty(growable: true);
});
