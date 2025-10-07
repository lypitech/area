import 'package:area/model/action_model.dart';
import 'package:area/model/platform_model.dart';
import 'package:area/model/trigger_model.dart';
import 'package:dio/dio.dart';

class PlatformApi {

  final Dio _dio;

  PlatformApi(
    this._dio
  );

  Future<List<PlatformModel>> fetchPlatforms() async {
    final response = await _dio.get('/services');
    final list = response.data as List<dynamic>;

    return list
      .map((e) => PlatformModel.fromJson(Map<String, dynamic>.from(e)))
      .toList();
  }

}
