import 'package:area/data/provider/auth_api_provider.dart';
import 'package:area/service/auth_service.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final Provider<AuthService> authServiceProvider = Provider<AuthService>((ref) {
  final api = ref.read(authApiProvider);
  return AuthService(api);
});