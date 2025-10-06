import 'package:area/api/auth_api.dart';
import 'package:area/data/provider/dio_provider.dart';
import 'package:area/service/auth_service.dart';
import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final authDioProvider = Provider<Dio>((ref) {
  final apiUrl = '${dotenv.env['API_URL']!}:${dotenv.env['API_PORT']!}';
  final dio = Dio(
    BaseOptions(
      baseUrl: apiUrl
    ),
  );

  return dio;
});

final authApiProvider = Provider<AuthApi>((ref) {
  final dio = ref.read(dioProvider);

  return AuthApi(dio: dio);
});

final tokenStorageProvider = Provider<FlutterSecureStorage>((ref) {
  return FlutterSecureStorage();
});

final authServiceProvider = Provider<AuthService>((ref) {
  final authService = AuthService(
    api: ref.read(authApiProvider),
    tokenStorage: ref.read(tokenStorageProvider)
  );

  authService.init();
  return authService;
});

enum AuthStatus {
  unknown,
  unauthenticated,
  authenticated;
}

class AuthState {

  final AuthStatus status;
  final Map<String, dynamic>? user;

  AuthState._({
    required this.status,
    this.user
  });

  factory AuthState.unknown() => AuthState._(status: AuthStatus.unknown);
  factory AuthState.authenticated(Map<String, dynamic>? user) => AuthState._(status: AuthStatus.authenticated, user: user);
  factory AuthState.unauthenticated() => AuthState._(status: AuthStatus.unauthenticated);

}

class AuthNotifier extends StateNotifier<AuthState> {

  final AuthApi api;
  final AuthService service;

  AuthNotifier({
    required this.api,
    required this.service
  }) : super(AuthState.unknown());

  Future<void> login({
    required String email,
    required String password
  }) async {
    try {
      final response = await api.login(email: email, password: password);
      final access = response['accessToken'] as String?;
      final refresh = response['refreshToken'] as String?;
      final user = response['user'] as Map<String, dynamic>?;

      if (access != null && refresh != null) {
        await service.saveTokens(accessToken: access, refreshToken: refresh);
        state = AuthState.authenticated(user);
      } else {
        state = AuthState.unauthenticated();
        throw Exception('Invalid login response');
      }
    } catch (e) {
      state = AuthState.unauthenticated();
      rethrow;
    }
  }

  Future<void> logout() async {
    final refresh = await service.getRefreshToken();

    if (refresh != null) {
      try {
        await api.logout(refreshToken: refresh);
      } catch (_) {}
    }

    await service.clearTokens();
    state = AuthState.unauthenticated();
  }

  /// Called at app start to initialize auth state (see InitPage)
  Future<void> checkAuth() async {
    final access = await service.getAccessToken();
    final refresh = await service.getRefreshToken();

    if (access != null) {
      state = AuthState.authenticated({});
      return;
    }

    if (refresh != null) {
      final ok = await service.refreshIfNeeded();

      if (ok) {
        state = AuthState.authenticated({});
        return;
      }
    }

    state = AuthState.unauthenticated();
  }

}

final authNotifierProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(
    api: ref.read(authApiProvider),
    service: ref.read(authServiceProvider)
  );
});
