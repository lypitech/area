import 'package:area/core/constant/constants.dart';
import 'package:dio/dio.dart';

class AuthApi {

  final Dio _dio;

  AuthApi(this._dio);

  Future<JsonData> login({
    required String email,
    required String password,
  }) async {
    final response = await _dio.post(
      '/login',
      data: {
        'email': email,
        'password': password,
      },
    );

    return response.data as JsonData;
  }

}
