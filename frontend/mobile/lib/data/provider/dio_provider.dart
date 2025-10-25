import 'package:area/data/provider/app_settings_provider.dart';
import 'package:area/data/provider/auth_provider.dart';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final dioProvider = FutureProvider<Dio>((ref) async {
  final appSettings = await ref.watch(appSettingsProvider.future);

  final dio = Dio(
    BaseOptions(
      baseUrl: appSettings.fullUrl
    ),
  );

  dio.interceptors.add(AuthInterceptor(ref: ref));

  ref.onDispose(() {
    try {
      dio.close(force: true);
    } catch (_) {}
  });
  return dio;
});
