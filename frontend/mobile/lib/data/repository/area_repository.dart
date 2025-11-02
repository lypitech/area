import 'package:area/api/area_api.dart';
import 'package:area/modal/area_modal.dart';
import 'package:area/model/action_model.dart';
import 'package:area/model/area_history_entry.dart';
import 'package:area/model/area_model.dart';
import 'package:area/model/platform_model.dart';
import 'package:area/model/trigger_model.dart';
import 'package:area/model/user_model.dart';

class AreaRepository {

  final AreaApi api;

  AreaRepository({
    required this.api
  });

  Future<List<AreaModel>> fetchAreas({
    required UserModel user
  }) async {
    final areasData = await api.getAreas(user.uuid);

    final futures = areasData.map((areaJson) async {
      final areaUuid = areaJson['uuid'] ?? areaJson['_id'] ?? areaJson['area_uuid'];
      if (areaUuid == null) {
        throw Exception('Missing AREA UUID in $areaJson'); // impossible but hey
      }

      final triggerJson = await api.getAreaTriggers(user.uuid, areaUuid);
      final responseJson = await api.getAreaActions(user.uuid, areaUuid);

      final trigger = TriggerModel.fromJson(triggerJson);
      final action = ActionModel.fromJson(responseJson);

      final triggerPlatform = PlatformModel(name: triggerJson['service_name']);
      final responsePlatform = PlatformModel(name: responseJson['service_name']);

      return AreaModel(
        uuid: areaJson['uuid'],
        name: areaJson['name'],
        trigger: trigger,
        action: action,
        actionPlatform: triggerPlatform,
        reactionPlatform: responsePlatform,
        createdAt: DateTime.tryParse(areaJson['createdAt'] ?? ''),
        updatedAt: DateTime.tryParse(areaJson['updatedAt'] ?? ''),
        isSyncing: false,
        history: (areaJson['history'] as List<dynamic>)
          .map((e) => AreaHistoryEntry.fromJson(e))
          .toList()
      );
    }).toList();

    final fullAreas = await Future.wait(futures); // parallel fetching so that it doesn't take 3 plombs
    return fullAreas;
  }

  Future<AreaModel> createArea({
    required UserModel user,
    required AreaModal area
  }) async {
    final response = await api.createArea(
      userUuid: user.uuid,
      area: area,
    );

    if (response == null || response.containsKey('error')) {
      throw Exception(response?['message'] ?? 'Unknown error.');
    }

    final areaUuid = response['uuid'];
    final triggerJson = await api.getAreaTriggers(user.uuid, areaUuid);
    final responseJson = await api.getAreaActions(user.uuid, areaUuid);

    return AreaModel(
      uuid: areaUuid,
      name: response['name'],
      trigger: TriggerModel.fromJson(triggerJson),
      action: ActionModel.fromJson(responseJson),
      actionPlatform: PlatformModel(name: triggerJson['service_name']),
      reactionPlatform: PlatformModel(name: responseJson['service_name']),
      createdAt: DateTime.tryParse(response['createdAt'] ?? ''),
      updatedAt: DateTime.tryParse(response['updatedAt'] ?? ''),
      isSyncing: false,
      history: (response['history'] as List<dynamic>)
        .map((e) => AreaHistoryEntry.fromJson(e))
        .toList()
    );
  }

  Future<void> deleteArea({
    required UserModel user,
    required String areaUuid
  }) async {
    final res = await api.deleteArea(user.uuid, areaUuid);

    if (res == null || res.containsKey('error')) {
      throw Exception(res?['message'] ?? 'Unknown error');
    }
  }

  Future<AreaModel> refreshArea({
    required UserModel user,
    required String areaUuid,
  }) async {
    final data = await api.getArea(user.uuid, areaUuid);
    final triggerJson = await api.getAreaTriggers(user.uuid, areaUuid);
    final responseJson = await api.getAreaActions(user.uuid, areaUuid);

    return AreaModel(
      uuid: data['uuid'],
      name: data['name'] ?? 'Unnamed Area',
      trigger: TriggerModel.fromJson(triggerJson),
      action: ActionModel.fromJson(responseJson),
      actionPlatform: PlatformModel(name: triggerJson['service_name']),
      reactionPlatform: PlatformModel(name: responseJson['service_name']),
      createdAt: DateTime.tryParse(data['createdAt'] ?? ''),
      updatedAt: DateTime.tryParse(data['updatedAt'] ?? ''),
      isSyncing: false,
      history: (data['history'] as List<dynamic>)
        .map((e) => AreaHistoryEntry.fromJson(e))
        .toList()
    );
  }

}