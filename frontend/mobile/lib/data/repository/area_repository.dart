import 'package:area/api/area_api.dart';
import 'package:area/modal/area_modal.dart';
import 'package:area/model/area_model.dart';
import 'package:area/model/user_model.dart';

class AreaRepository {

  final AreaApi api;

  AreaRepository({
    required this.api
  });

  Future<List<AreaModel>> fetchAreas({
    required UserModel user
  }) async {
    final data = await api.getAreas(user.uuid);
    return data.map((json) => AreaModel.fromJson(json)).toList();
  }

  Future<AreaModel> createArea({
    required UserModel user,
    required AreaModal area
  }) async {
    // try {
      final response = await api.createArea(
        userUuid: user.uuid,
        area: area
      );

      return AreaModel.fromJson(response);
    // } catch (_) {
      // return area.copyWith(isSyncing: true);
    // }
  }

  Future<void> deleteArea({
    required UserModel user,
    required String areaUuid
  }) async {
    await api.deleteArea(user.uuid, areaUuid);
  }

  Future<AreaModel> refreshArea({
    required UserModel user,
    required String areaUuid
  }) async {
    final data = await api.getArea(user.uuid, areaUuid);
    final triggers = await api.getAreaTriggers(user.uuid, areaUuid);
    final responses = await api.getAreaActions(user.uuid, areaUuid);

    return AreaModel.fromJson({
      ...data,
      'triggers': triggers['triggers'] ?? [],
      'responses': responses['responses'] ?? [],
    });
  }

}