import 'dart:async';

import 'package:area/api/auth_api.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {

  final AuthApi api;
  final FlutterSecureStorage tokenStorage;

  String? _accessToken;
  Completer<void>? _refreshCompleter;

  static const _kRefreshKey = 'refresh_token';
  static const _kAccessKey = 'access_token';

  AuthService({
    required this.api,
    required this.tokenStorage,
  });

  Future<void> init() async {
    _accessToken = await tokenStorage.read(key: _kAccessKey);
  }

  Future<String?> getAccessToken() async => _accessToken;
  Future<String?> getRefreshToken() async => tokenStorage.read(key: _kRefreshKey);

  Future<void> saveTokens({required String accessToken, required String refreshToken}) async {
    _accessToken = accessToken;

    await tokenStorage.write(
      key: _kAccessKey,
      value: accessToken
    );
    await tokenStorage.write(
      key: _kRefreshKey,
      value: refreshToken
    );
  }

  Future<void> clearTokens() async {
    _accessToken = null;
    await tokenStorage.delete(key: _kAccessKey);
    await tokenStorage.delete(key: _kRefreshKey);
  }

  /// Ensures only one refresh runs at a time. Returns true if refresh succeeded.
  Future<bool> refreshIfNeeded() async {
    if (_refreshCompleter != null) {
      // Someone else is refreshing — wait for it
      await _refreshCompleter!.future;
      return _accessToken != null;
    }

    final refreshToken = await getRefreshToken();
    if (refreshToken == null) {
      return false;
    }

    _refreshCompleter = Completer<void>();
    try {
      final data = await api.refresh(refreshToken: refreshToken);

      final newAccess = data?['access_token'] as String?;

      if (newAccess != null) {
        await saveTokens(
          accessToken: newAccess,
          refreshToken: refreshToken
        );
        _refreshCompleter!.complete();
        _refreshCompleter = null;
        return true;
      } else {
        await clearTokens();
        _refreshCompleter!.complete();
        _refreshCompleter = null;
        return false;
      }
    } catch (e) {
      await clearTokens();
      _refreshCompleter!.complete();
      _refreshCompleter = null;
      return false;
    }
  }

}
