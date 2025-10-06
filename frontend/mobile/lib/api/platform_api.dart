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
    /**
     * This is real code, but backend is still not really linked so, we'll do
     * with temporary data for now.
     */

    /*
    final response = await _dio.get('/platforms');
    final list = response.data as List<dynamic>;

    return list
      .map((e) => PlatformModel.fromJson(Map<String, dynamic>.from(e)))
      .toList();
    */

    return [
      PlatformModel(
        uuid: '0656281f-78da-4e4f-9a63-1a53b8ed7f5c',
        name: 'Spotify',
        triggers: [
          TriggerModel(
            uuid: 'd8439871-a4d6-427b-97c8-e067e6563d53',
            name: 'Liked a new song',
            description: 'This trigger triggers every time a new song is added to the liked songs.'
          ),
          TriggerModel(
            uuid: '79ec0ede-cb08-4254-a774-49e91ae29129',
            name: 'Posted a new song',
            description: 'This trigger triggers every time a new song is posted.'
          ),
        ],
      ),
      PlatformModel(
        uuid: 'fa6cee13-c1f8-4264-9b10-c5f981685f8a',
        name: 'Instagram',
        actions: [
          ActionModel(
            uuid: '92i3cbec-e6c3-4522-aa7a-4d493dbf0c41',
            name: 'Post a new story',
            description: 'This actions creates a new story.'
          )
        ]
      ),
      PlatformModel(
        uuid: 'f3594d07-5059-4052-995c-0d3bad61e2b0',
        name: 'X (formerly Twitter)'
      ),
      PlatformModel(
        uuid: 'e823bfb4-d2d6-4ff4-9c88-66327abc9bbf',
        name: 'Google'
      ),
      PlatformModel(
        uuid: '98d4a2fa-0d60-4cc9-82cd-70dcb31760a0',
        name: 'GitHub'
      ),
      PlatformModel(
        uuid: '565ffe62-12ba-427f-8593-57e9a54e24ad',
        name: 'Discord'
      ),
    ];
  }

}
