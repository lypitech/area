import 'package:area/core/constant/constants.dart';

class UserModel {

  final String uuid;
  final String username;
  final String nickname;
  final String email;

  const UserModel({
    required this.uuid,
    required this.username,
    required this.nickname,
    required this.email,
  });

  factory UserModel.fromJson(JsonData data) {
    return UserModel(
      uuid: data['uuid'],
      username: data['username'],
      nickname: data['nickname'],
      email: data['email']
    );
  }

  JsonData toJson() {
    return {
      'uuid': uuid,
      'username': username,
      'nickname': nickname,
      'email': email
    };
  }

}
