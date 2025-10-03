import 'package:area/modal/area_modal.dart';
import 'package:area/model/action_model.dart';
import 'package:area/model/platform_model.dart';
import 'package:area/model/trigger_model.dart';

class AreaModel {

  PlatformModel actionPlatform;
  TriggerModel trigger;
  PlatformModel reactionPlatform;
  ActionModel action;

  AreaModel({
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
      actionPlatform: modal.actionPlatform!,
      trigger: modal.trigger!,
      reactionPlatform: modal.reactionPlatform!,
      action: modal.action!
    );
  }

}
