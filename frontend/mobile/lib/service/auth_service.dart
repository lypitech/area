import 'package:area/api/auth_api.dart';

enum AuthStatus {

  unknown,
  authenticated,
  unauthenticated;

}

class AuthService {

  final AuthApi _api;
  String? _token;

  AuthService(this._api);

  Future<void> login(String email, String password) async {
    final data = await _api.login(email: email, password: password);
    _token = data['_id'];
  }

  bool get isLoggedIn => _token != null;

  void logout() {
    _token = null;
  }

}
