import 'package:area/core/constant/constants.dart';
import 'package:dio/dio.dart';

class OauthApi {

  final Dio dio;

  OauthApi({
    required this.dio,
  });

  Future<JsonData?> githubLogin({
    required String userUuid,
    required String code
  }) async {
    try {
      final response = await dio.post(
        '/oauth/github',
        data: {
          'uuid': userUuid,
          'code': code,
          'front': false // Telling the API we're mobile client.
        }
      );
      return response.data as JsonData;
    } on DioException catch (exception) {
      return exception.response?.data as JsonData?;
    }
  }

  Future<JsonData?> twitchLogin({
    required String userUuid,
    required String code
  }) async {
    try {
      final response = await dio.post(
        '/oauth/twitch',
        data: {
          'uuid': userUuid,
          'code': code,
        }
      );
      return response.data as JsonData;
    } on DioException catch (exception) {
      return exception.response?.data as JsonData?;
    }
  }

}
