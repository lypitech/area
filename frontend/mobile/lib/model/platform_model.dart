import 'dart:convert';

import 'package:area/core/constant/constants.dart';
import 'package:area/model/action_model.dart';
import 'package:area/model/trigger_model.dart';
import 'package:flutter/material.dart';

class PlatformModel {

  final String uuid;
  final String name;
  final String? iconBase64;
  final Image? icon;
  final List<TriggerModel> triggers;
  final List<ActionModel> actions;

  PlatformModel({
    required this.uuid,
    required this.name,
    this.iconBase64,
    this.icon,
    this.triggers = const [],
    this.actions = const [],
  });

  factory PlatformModel.fromJson(JsonData json) {
    final b64 = json['icon'] as String?;
    return PlatformModel(
      uuid: json['uuid'] as String,
      name: json['name'] as String,
      iconBase64: b64,
      icon: (b64 == null || b64.isEmpty) ? null : Image.memory(base64Decode(b64)),
      triggers: (json['actions'] as List<dynamic>?)
          ?.map((e) => TriggerModel.fromJson(JsonData.from(e)))
          .toList()
        ?? [],
      actions: (json['reactions'] as List<dynamic>?)
          ?.map((e) => ActionModel.fromJson(JsonData.from(e)))
          .toList()
        ?? [],
    );
  }

  JsonData toJson() => {
    'uuid': uuid,
    'name': name,
    'icon': iconBase64,
    'actions': triggers.map((t) => t.toJson()).toList(),
    'reactions': actions.map((a) => a.toJson()).toList(),
  };

}
