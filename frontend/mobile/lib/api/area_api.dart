import 'package:area/core/constant/constants.dart';
import 'package:area/model/area_model.dart';
import 'package:dio/dio.dart';

class AreaApi {

  final Dio dio;

  AreaApi({
    required this.dio
  });

  Future<JsonData> getArea(String userUuid, String areaUuid) async {
    final response = await dio.get('/users/$userUuid/areas/$areaUuid');
    return response.data as JsonData;
  }

  Future<List<JsonData>> getAreas(String userUuid) async {
    final response = await dio.get('/users/$userUuid/areas');
    return (response.data as List).cast<JsonData>();
  }

  Future<JsonData> createArea({
    required String userUuid,
    required AreaModel area
  }) async {
    final response = await dio.post(
      '/users/$userUuid/areas',
      data: {
        'name': area.name,
        'trigger_uuid': area.trigger.uuid,
        'action_uuid': area.action.uuid,
        'trigger_platform_uuid': area.actionPlatform.uuid,
        'reaction_platform_uuid': area.reactionPlatform.uuid,
      },
    );
    return response.data as JsonData;
  }

  Future<void> deleteArea(String userUuid, String areaUuid) async {
    await dio.delete('/users/$userUuid/areas/$areaUuid');
  }

  Future<JsonData> getAreaTriggers(String userUuid, String areaUuid) async {
    final response = await dio.get('/users/$userUuid/areas/$areaUuid/trigger');
    return response.data as JsonData;
  }

  Future<JsonData> getAreaActions(String userUuid, String areaUuid) async {
    final response = await dio.get('/users/$userUuid/areas/$areaUuid/response');
    return response.data as JsonData;
  }

}
