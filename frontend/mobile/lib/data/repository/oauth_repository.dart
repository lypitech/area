import 'package:area/api/oauth_api.dart';

class OauthRepository {

  final OauthApi api;

  OauthRepository({
    required this.api
  });

  Future<void> githubLogin({
    required String userUuid,
    required String code,
  }) async {
    final response = await api.githubLogin(
      userUuid: userUuid,
      code: code
    );

    if (response == null || response.containsKey('error')) {
      throw Exception(response?['message'] ?? 'Unknown error.');
    }
  }

}
