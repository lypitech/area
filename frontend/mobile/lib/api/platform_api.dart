import 'package:area/core/constant/constants.dart';
import 'package:area/model/platform_model.dart';
import 'package:dio/dio.dart';

class PlatformApi {

  final Dio dio;

  PlatformApi(
    this.dio
  );

  Future<List<PlatformModel>> fetchPlatforms() async {
    final response = await dio.get('/services');
    final list = response.data as List<dynamic>;

    return list
      .map((e) => PlatformModel.fromJson(JsonData.from(e)))
      .toList();
  }

}
