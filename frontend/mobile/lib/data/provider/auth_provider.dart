import 'package:area/api/auth_api.dart';
import 'package:area/data/provider/dio_provider.dart';
import 'package:area/service/auth_service.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';

final Provider<AuthApi> authApiProvider = Provider<AuthApi>((ref) {
  final dio = ref.read(dioProvider);
  return AuthApi(dio);
});

final Provider<AuthService> authServiceProvider = Provider<AuthService>((ref) {
  final api = ref.read(authApiProvider);
  return AuthService(api);
});

final authStateProvider = StateProvider<bool?>((_) => null);
