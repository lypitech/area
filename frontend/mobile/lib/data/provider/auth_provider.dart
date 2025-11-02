import 'dart:async';

import 'package:area/api/auth_api.dart';
import 'package:area/core/constant/constants.dart';
import 'package:area/data/provider/app_settings_provider.dart';
import 'package:area/data/provider/main_page_route_provider.dart';
import 'package:area/model/user_model.dart';
import 'package:area/service/auth_service.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:go_router/go_router.dart';

final authDioProvider = FutureProvider<Dio>((ref) async {
  final appSettings = await ref.watch(appSettingsProvider.future);

  final dio = Dio(
    BaseOptions(
      baseUrl: appSettings.fullUrl
    ),
  );

  ref.onDispose(() {
    try {
      dio.close(force: true);
    } catch (_) {}
  });

  return dio;
});

class AuthInterceptor extends Interceptor {

  final Ref ref;

  AuthInterceptor({
    required this.ref
  });

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    try {
      final authService = await ref.watch(authServiceProvider.future);
      final access = await authService.getAccessToken();

      if (access != null) {
        options.headers['Authorization'] = 'Bearer $access';
      }
    } catch (_) {}

    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    final requestOptions = err.requestOptions;

    // If 401, try to refresh
    if (err.response?.statusCode == 401 && requestOptions.extra['retried'] != true) {
      try {
        final authService = await ref.watch(authServiceProvider.future);
        final refreshed = await authService.refreshIfNeeded();

        if (refreshed) {
          final newAccess = await authService.getAccessToken();

          if (newAccess == null) {
            return;
          }

          requestOptions.extra['retried'] = true; // To avoid infinite loops

          final newOptions = Options(
            method: requestOptions.method,
            headers: {
              ...requestOptions.headers,
              'Authorization': 'Bearer $newAccess',
            },
          );

          final dio = await ref.watch(authDioProvider.future);
          final response = await dio.request(
            requestOptions.path,
            data: requestOptions.data,
            queryParameters: requestOptions.queryParameters,
            options: newOptions,
          );

          return handler.resolve(response);
        }
      } catch (_) {}
    }

    handler.next(err);
  }

}

final authApiProvider = FutureProvider<AuthApi>((ref) async {
  final dio = await ref.watch(authDioProvider.future);
  return AuthApi(dio: dio);
});

final tokenStorageProvider = Provider<FlutterSecureStorage>((ref) {
  return FlutterSecureStorage();
});

final authServiceProvider = FutureProvider<AuthService>((ref) async {
  final api = await ref.watch(authApiProvider.future);
  final storage = ref.watch(tokenStorageProvider);
  final service = AuthService(
    api: api,
    tokenStorage: storage
  );

  await service.init();
  return service;
});

enum AuthStatus {
  unknown,
  unauthenticated,
  authenticated;
}

class AuthState {

  final AuthStatus status;
  final UserModel? user;

  AuthState._({
    required this.status,
    this.user
  });

  factory AuthState.unknown() => AuthState._(status: AuthStatus.unknown);
  factory AuthState.authenticated(JsonData? user) => AuthState._(
    status: AuthStatus.authenticated,
    user: user == null ? null : UserModel.fromJson(user)
  );
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
      final loginResponse = await api.login(
        email: email,
        password: password
      );

      if (loginResponse == null || loginResponse.containsKey('error')) {
        throw Exception('Login failed. ${loginResponse?['message']}');
      }

      final access = loginResponse['access_token'] as String?;
      final refresh = loginResponse['refresh_token'] as String?;

      if (access == null || refresh == null) {
        state = AuthState.unauthenticated();
        throw Exception('Invalid login response (missing tokens response)');
      }

      final user = await api.getUser(refreshToken: refresh);
      await service.saveTokens(accessToken: access, refreshToken: refresh);
      state = AuthState.authenticated(user);
    } catch (e) {
      state = AuthState.unauthenticated();
      rethrow;
    }
  }

  Future<void> oauthLogin(String oauthService, String code) async {
    try {
      final loginResponse = await api.oauthLogin(
        service: 'github',
        code: code
      );

      if (loginResponse == null) {
        throw Exception('Null response from backend');
      }

      final access = loginResponse['access_token'] as String?;
      final refresh = loginResponse['refresh_token'] as String?;

      print("access: $access, refresh: $refresh");
      print("access: $access, refresh: $refresh");
      print("access: $access, refresh: $refresh");
      print("access: $access, refresh: $refresh");

      if (access == null || refresh == null) {
        throw Exception('Invalid login response (missing tokens)');
      }

      print("before saving tokens");
      await service.saveTokens(accessToken: access, refreshToken: refresh);

      print("after saving tokens");

      print("before getting user");
      final user = await api.getUser(refreshToken: refresh);
      print("after getting user");
      print(user..remove('profilePicture'));

      print(UserModel.fromJson(user));

      print('after');
      state = AuthState.authenticated(user);
      print("so here we're good ig");
    } catch (e) {
      state = AuthState.unauthenticated();
      rethrow;
    }
  }

  Future<void> register({
    required String email,
    required String password,
    required String nickname,
    required String username,
  }) async {
    try {
      final registerResponse = await api.register(
        email: email,
        password: password,
        nickname: nickname,
        username: username,
      );

      if (registerResponse == null || registerResponse.containsKey('error')) {
        throw Exception('Registration failed. ${registerResponse?['message']}');
      }

      final loginResponse = await api.login(
        email: email,
        password: password,
      );

      if (loginResponse == null || loginResponse.containsKey('error')) {
        throw Exception('Login failed. ${loginResponse?['message']}');
      }

      final access = loginResponse['access_token'] as String?;
      final refresh = loginResponse['refresh_token'] as String?;

      if (access != null && refresh != null) {
        await service.saveTokens(accessToken: access, refreshToken: refresh);

        final user = await api.getUser(refreshToken: refresh);

        state = AuthState.authenticated(user);
      } else {
        throw Exception('Invalid login response after register (register may have been unsuccessful)');
      }
    } catch (e) {
      state = AuthState.unauthenticated();
      rethrow;
    }
  }

  Future<void> oauthRegister(String oauthService, String code) async {
    try {
      final registerResponse = await api.oauthRegister(
        service: oauthService,
        code: code
      );

      if (registerResponse == null || registerResponse.containsKey('error')) {
        throw Exception('Registration failed. ${registerResponse?['message']}');
      }

      await oauthLogin(oauthService, code);
    } catch (e) {
      state = AuthState.unauthenticated();
      rethrow;
    }
  }

  Future<void> logout() async {
    final refresh = await service.getRefreshToken();

    state = AuthState.unauthenticated();

    if (refresh != null) {
      unawaited(_safeLogout(refresh));
    }

    await service.clearTokens();
  }

  Future<void> _safeLogout(String refreshToken) async {
    try {
      await api.logout(refreshToken: refreshToken);
    } catch (e) {
      print("Error while logging out: $e");
    }
  }

  /// Called at app start to initialize auth state (see InitPage)
  Future<void> checkAuth() async {
    try {
      final refresh = await service.getRefreshToken();

      print("CHECKAUTH: refresh: $refresh");
      if (refresh == null) {
        print("CHECKAUTH: null, unauthenticated");
        state = AuthState.unauthenticated();
        return;
      }

      print("CHECKAUTH: not null, will try to get the user vro");

      try {
        final user = await api.getUser(refreshToken: refresh);
        print("CHECKAUTH: user: $user");

        state = AuthState.authenticated(user);
        return;
      } catch (e) {
        print("CHECKAUTH: ok error, maybe the tokens are invalidated");

        final refreshed = await service.refreshIfNeeded();
        print("CHECKAUTH: refreshed tokens");

        if (refreshed) {
          print("CHECKAUTH: nice the tokens are refreshed");

          final newRefreshToken = await service.getRefreshToken();

          if (newRefreshToken != null) {
            print("CHECKAUTH: ok nice will authenticate");

            final user = await api.getUser(refreshToken: newRefreshToken);
            state = AuthState.authenticated(user);
            return;
          }
        }
        print("CHECKAUTH: tokens are invalid now, unlogging");

        await service.clearTokens();
        state = AuthState.unauthenticated();
      }
    } catch (e) {
      state = AuthState.unauthenticated();
    }
  }

  Future<void> deleteAccount() async {
    final user = state.user;
    if (user == null) {
      throw Exception('No user logged in'); // basically impossible but yk
    }

    try {
      await api.deleteUser(userUuid: user.uuid);
      await logout();
    } catch (e) {
      rethrow;
    }
  }

  UserModel? getUser() {
    return state.user;
  }

}

final authNotifierProvider = FutureProvider<AuthNotifier>((ref) async {
  final api = await ref.watch(authApiProvider.future);
  final service = await ref.watch(authServiceProvider.future);
  final notifier = AuthNotifier(api: api, service: service);

  return notifier;
});

void authLogout(BuildContext context, WidgetRef ref) async {
  final authNotifier = await ref.read(authNotifierProvider.future);

  await authNotifier.logout();
  ref.read(mainPageRouteProvider.notifier).state = 'myareas';

  if (context.mounted) {
    context.go('/login');
  }
}
