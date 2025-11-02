import 'package:area/api/oauth_api.dart';
import 'package:area/data/provider/dio_provider.dart';
import 'package:area/data/repository/oauth_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final oauthApiProvider = FutureProvider<OauthApi>((ref) async {
  final dio = await ref.watch(dioProvider.future);
  return OauthApi(dio: dio);
});

final oauthRepositoryProvider = FutureProvider<OauthRepository>((ref) async {
  final api = await ref.watch(oauthApiProvider.future);
  return OauthRepository(api: api);
});