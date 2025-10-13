import 'package:area/data/provider/auth_provider.dart';
import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final Provider<Dio> dioProvider = Provider<Dio>((ref) {
  final apiUrl = '${dotenv.env['API_URL']!}:${dotenv.env['API_PORT']!}';
  final dio = Dio(
    BaseOptions(
      baseUrl: apiUrl
    ),
  );

  dio.interceptors.add(AuthInterceptor(ref: ref));
  return dio;
});
