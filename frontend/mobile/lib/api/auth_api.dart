import 'package:area/core/constant/constants.dart';
import 'package:dio/dio.dart';

class AuthApi {

  final Dio dio;

  AuthApi({
    required this.dio
  });

  Future<JsonData?> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await dio.post(
        '/user/login',
        data: {
          'email': email,
          'password': password,
        },
      );
      return response.data as JsonData;
    } on DioException catch (e) {
      return e.response?.data as JsonData?;
    }
  }

  Future<JsonData?> register({
    required String email,
    required String password,
    required String nickname,
    required String username,
  }) async {
    try {
      final response = await dio.post(
        '/user/register',
        data: {
          'email': email,
          'password': password,
          'nickname': nickname,
          'username': username,
        },
      );
      return response.data as JsonData;
    } on DioException catch (e) {
      return e.response?.data as JsonData?;
    }
  }

  Future<JsonData?> refresh({
    required String refreshToken
  }) async {
    try {
      final response = await dio.post(
        '/user/refresh',
        data: {
          'refresh_token': refreshToken
        }
      );
      return response.data as JsonData;
    } on DioException catch (e) {
      return e.response?.data as JsonData?;
    }
  }

  Future<void> logout({
    required String refreshToken
  }) async {
    await dio.post(
      '/user/logout',
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

  Future<JsonData?> deleteUser({
    required String userUuid
  }) async {
    final response = await dio.delete('/users/$userUuid');
    return response.data as JsonData;
  }

}
