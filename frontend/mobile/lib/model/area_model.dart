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

}
