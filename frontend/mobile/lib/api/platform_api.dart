import 'package:area/model/platform_model.dart';
import 'package:dio/dio.dart';

class PlatformApi {

  final Dio _dio;

  PlatformApi(
    this._dio
  );

  Future<List<PlatformModel>> fetchPlatforms() async {
    /**
     * This is real code, but backend is still not really linked so, we'll do
     * with temporary data for now.
     */

    /*
    final resp = await _dio.get('/platforms');
    final list = resp.data as List<dynamic>;

    return list
      .map((e) => PlatformModel.fromJson(Map<String, dynamic>.from(e)))
      .toList();
    */

    return [
      PlatformModel(
        uuid: '',
        name: 'Spotify'
      ),
      PlatformModel(
        uuid: '',
        name: 'Instagram'
      ),
      PlatformModel(
        uuid: '',
        name: 'X (formerly Twitter)'
      ),
      PlatformModel(
        uuid: '',
        name: 'Google'
      ),
      PlatformModel(
        uuid: '',
        name: 'GitHub'
      ),
      PlatformModel(
        uuid: '',
        name: 'Discord'
      ),
    ];
  }

}
