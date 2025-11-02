import 'package:area/core/constant/constants.dart';
import 'package:area/modal/area_modal.dart';
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

  Future<JsonData?> createArea({
    required String userUuid,
    required AreaModal area
  }) async {
    print('AREA_CREATE: Creating...');

    try {
      final response = await dio.post(
        '/areas',
        data: {
          'name': area.title,
          'description': 'Sample description',
          'trigger': {
            'service_name': area.actionPlatform?.name,
            'name': area.trigger?.name,
            'description': area.trigger?.description,
            'input': area.triggerParameters,
            'trigger_type': area.trigger?.type
          },
          'response': {
            'service_name': area.reactionPlatform?.name,
            'name': area.action?.name,
            'description': area.action?.description,
            'resource_ids': area.actionParameters,
            'payload': area.actionPayload
          },
          'user_uuid': userUuid,
          'enabled': 'true',
        },
      );

      print('AREA_CREATE: Created! Here is the response');
      print(response.data);

      return response.data as JsonData;
    } on DioException catch (exception) {
      return exception.response?.data as JsonData?;
    }

  }

  Future<JsonData?> deleteArea(String userUuid, String areaUuid) async {
    try {
      await dio.delete('/users/$userUuid/areas/$areaUuid');
      return null;
    } on DioException catch (exception) {
      return (exception.response?.data ?? {'error': 'UNKNOWN', 'message': 'UNKNOWN'}) as JsonData;
    }
  }

  Future<JsonData> getAreaTriggers(String userUuid, String areaUuid) async {
    final response = await dio.get('/users/$userUuid/areas/$areaUuid/trigger');
    return response.data as JsonData;
  }

  Future<JsonData> getAreaActions(String userUuid, String areaUuid) async {
    final response = await dio.get('/users/$userUuid/areas/$areaUuid/response');
    return response.data as JsonData;
  }

  Future<JsonData> enableArea(String userUuid, String areaUuid) async {
    final response = await dio.post('/users/$userUuid/areas/$areaUuid/enable');
    return response.data as JsonData;
  }

  Future<JsonData> disableArea(String userUuid, String areaUuid) async {
    final response = await dio.post('/users/$userUuid/areas/$areaUuid/disable');
    return response.data as JsonData;
  }

}
