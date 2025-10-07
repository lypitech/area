import 'package:area/core/constant/constants.dart';
import 'package:area/modal/area_modal.dart';
import 'package:area/model/action_model.dart';
import 'package:area/model/platform_model.dart';
import 'package:area/model/trigger_model.dart';

class AreaModel {

  final String title;
  final PlatformModel actionPlatform;
  final TriggerModel trigger;
  final PlatformModel reactionPlatform;
  final ActionModel action;

  AreaModel({
    required this.title,
    required this.actionPlatform,
    required this.trigger,
    required this.reactionPlatform,
    required this.action
  });

  factory AreaModel.fromModal(AreaModal modal) {
    if (!modal.isComplete()) {
      throw UnimplementedError();
    }

    return AreaModel(
      title: modal.title!,
      actionPlatform: modal.actionPlatform!,
      trigger: modal.trigger!,
      reactionPlatform: modal.reactionPlatform!,
      action: modal.action!
    );
  }

  factory AreaModel.fromJson(JsonData data) {
    return AreaModel(
      title: data['title'],
      actionPlatform: PlatformModel.fromJson(data['action_platform']),
      trigger: TriggerModel.fromJson(data['trigger']),
      reactionPlatform: PlatformModel.fromJson(data['reaction_platform']),
      action: ActionModel.fromJson(data['action'])
    );
  }

  JsonData toJson() {
    return {
      'title': title,
      'action_platform': actionPlatform.toJson(),
      'trigger': trigger.toJson(),
      'reaction_platform': reactionPlatform.toJson(),
      'action': action.toJson()
    };
  }

}
