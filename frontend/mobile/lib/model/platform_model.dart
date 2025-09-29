import 'package:area/model/action_model.dart';
import 'package:area/model/trigger_model.dart';
import 'package:flutter/material.dart';

class PlatformModel {

  final String uuid;
  final String name;
  final IconData icon;
  final List<TriggerModel> triggers;
  final List<ActionModel> actions;

  PlatformModel({
    required this.uuid,
    required this.name,
    required this.icon,
    this.triggers = const [],
    this.actions = const [],
  });

}
