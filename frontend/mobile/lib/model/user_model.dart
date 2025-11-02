import 'dart:convert';

import 'package:area/core/constant/constants.dart';
import 'package:flutter/material.dart';

class UserModel {

  final String uuid;
  final String username;
  final String nickname;
  final String email;
  final Map<String, String> oauthUuids;
  final Image? profilePictureBase64;

  const UserModel({
    required this.uuid,
    required this.username,
    required this.nickname,
    required this.email,
    required this.oauthUuids,
    this.profilePictureBase64
  });

  factory UserModel.fromJson(JsonData data) {
    print("FROMJSON CALLED");
    final oauthList = data['oauth_uuids'] as List? ?? [];
    final oauthUuids = {
      for (final e in oauthList)
        if (e is Map && e['service_name'] != null && e['token_uuid'] != null)
          e['service_name'] as String: e['token_uuid'] as String
    };
    print("PARSED OAUTHLIST");

    final rawImageBase64 = data['profilePicture'] as String?;

    print("PARSED RAWIMAGEBASE64: $rawImageBase64");
    return UserModel(
      uuid: data['uuid'],
      username: data['username'] as String? ?? '',
      nickname: data['nickname'],
      email: data['email'],
      oauthUuids: oauthUuids,
      profilePictureBase64: (rawImageBase64 != null && rawImageBase64.isNotEmpty)
        ? Image.memory(base64Decode(rawImageBase64))
        : null
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
