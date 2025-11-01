import 'package:area/core/constant/constants.dart';

class UserModel {

  final String uuid;
  final String username;
  final String nickname;
  final String email;
  final Map<String, String> oauthUuids;

  const UserModel({
    required this.uuid,
    required this.username,
    required this.nickname,
    required this.email,
    required this.oauthUuids
  });

  factory UserModel.fromJson(JsonData data) {
    final oauthList = data['oauth_uuids'] as List? ?? [];
    final oauthUuids = {
      for (final e in oauthList)
        if (e is Map && e['service_name'] != null && e['token_uuid'] != null)
          e['service_name'] as String: e['token_uuid'] as String
    };

    return UserModel(
      uuid: data['uuid'],
      username: data['username'],
      nickname: data['nickname'],
      email: data['email'],
      oauthUuids: oauthUuids
    );
  }

  JsonData toJson() {
    return {
      'uuid': uuid,
      'username': username,
      'nickname': nickname,
      'email': email,
      'oauth_uuids': oauthUuids.entries
        .map((e) => {
          'service_name': e.key,
          'token_uuid': e.value,
        })
        .toList()
    };
  }

}
