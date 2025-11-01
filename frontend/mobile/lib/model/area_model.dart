import 'package:area/core/constant/constants.dart';
import 'package:area/modal/area_modal.dart';
import 'package:area/model/action_model.dart';
import 'package:area/model/platform_model.dart';
import 'package:area/model/trigger_model.dart';

class AreaModel {

  final String? uuid;
  final String name;
  final PlatformModel actionPlatform;
  final TriggerModel trigger;
  final PlatformModel reactionPlatform;
  final ActionModel action;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final bool isSyncing;

  AreaModel({
    this.uuid,
    required this.name,
    required this.actionPlatform,
    required this.trigger,
    required this.reactionPlatform,
    required this.action,
    this.createdAt,
    this.updatedAt,
    this.isSyncing = false
  });

  factory AreaModel.fromModal(AreaModal modal) {
    if (!modal.isComplete()) {
      throw UnimplementedError();
    }

    return AreaModel(
      name: modal.title!,
      actionPlatform: modal.actionPlatform!,
      trigger: modal.trigger!,
      reactionPlatform: modal.reactionPlatform!,
      action: modal.action!
    );
  }

  factory AreaModel.fromJson(JsonData data) {
    return AreaModel(
      uuid: data['area_uuid'],
      name: data['name'],
      actionPlatform: PlatformModel.fromJson(data['action_platform']),
      trigger: TriggerModel.fromJson(data['trigger']),
      reactionPlatform: PlatformModel.fromJson(data['reaction_platform']),
      action: ActionModel.fromJson(data['action']),
      createdAt: data['createdAt'] != null
        ? DateTime.parse(data['createdAt'])
        : null,
      updatedAt: data['updatedAt'] != null
        ? DateTime.parse(data['updatedAt'])
        : null,
    );
  }

  JsonData toJson() {
    return {
      'area_uuid': uuid,
      'name': name,
      'action_platform': actionPlatform.toJson(),
      'trigger': trigger.toJson(),
      'reaction_platform': reactionPlatform.toJson(),
      'action': action.toJson(),
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }

  AreaModel copyWith({
    String? uuid,
    String? name,
    PlatformModel? actionPlatform,
    TriggerModel? trigger,
    PlatformModel? reactionPlatform,
    ActionModel? action,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? isSyncing,
  }) {
    return AreaModel(
      uuid: uuid ?? this.uuid,
      name: name ?? this.name,
      actionPlatform: actionPlatform ?? this.actionPlatform,
      trigger: trigger ?? this.trigger,
      reactionPlatform: reactionPlatform ?? this.reactionPlatform,
      action: action ?? this.action,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      isSyncing: isSyncing ?? this.isSyncing,
    );
  }

}
