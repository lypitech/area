import 'package:area/core/constant/constants.dart';
import 'package:dio/dio.dart';

class AuthApi {

  final Dio dio;

  AuthApi({
    required this.dio
  });

  Future<JsonData> login({
    required String email,
    required String password,
  }) async {
    final response = await dio.post(
      '/login',
      data: {
        'email': email,
        'password': password,
      },
    );
    return response.data as JsonData;
  }

  Future<JsonData> register({
    required String email,
    required String password,
    required String nickname,
    required String username,
  }) async {
    final response = await dio.post(
      '/login/register',
      data: {
        'email': email,
        'password': password,
        'nickname': nickname,
        'username': username,
      },
    );
    return response.data as JsonData;
  }

  Future<JsonData> refresh({
    required String refreshToken
  }) async {
    final response = await dio.post(
      '/login/refresh',
      data: {
        'refresh_token': refreshToken
      }
    );
    return response.data as JsonData;
  }

  Future<void> logout({
    required String refreshToken
  }) async {
    await dio.post(
      '/login/logout',
      data: {
        'refresh_token': refreshToken
      }
    );
  }

  Future<JsonData> getUser({
    required String refreshToken
  }) async {
    final response = await dio.get('/users/getuser/$refreshToken');
    return response.data as JsonData;
  }

}
