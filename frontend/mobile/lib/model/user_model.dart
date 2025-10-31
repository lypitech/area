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
    final rawOauthUuids = data['oauth_uuids'];
    final oauthUuids = <String, String>{};

    for (final element in rawOauthUuids) {
      if (element is Map) {
        oauthUuids.addAll(element.map((name, token) => MapEntry('$name', '$token')));
      }
    }

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
      'oauth_uuids': oauthUuids.entries.map((e) => {e.key: e.value}).toList()
    };
  }

}
