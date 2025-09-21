import 'package:area/api/auth_api.dart';
import 'package:area/data/provider/dio_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final Provider<AuthApi> authApiProvider = Provider<AuthApi>((ref) {
  final dio = ref.read(dioProvider);
  return AuthApi(dio);
});