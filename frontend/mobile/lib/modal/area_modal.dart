import 'package:area/model/action_model.dart';
import 'package:area/model/platform_model.dart';
import 'package:area/model/trigger_model.dart';
import 'package:flutter_riverpod/legacy.dart';

class AreaModal {

  PlatformModel? actionPlatform;
  TriggerModel? trigger;
  PlatformModel? reactionPlatform;
  ActionModel? action;

  AreaModal({
    this.actionPlatform,
    this.trigger,
    this.reactionPlatform,
    this.action
  });

  AreaModal copyWith({
    PlatformModel? actionPlatform,
    TriggerModel? trigger,
    PlatformModel? reactionPlatform,
    ActionModel? action,
  }) {
    return AreaModal(
      actionPlatform: actionPlatform ?? this.actionPlatform,
      trigger: trigger ?? this.trigger,
      reactionPlatform: reactionPlatform ?? this.reactionPlatform,
      action: action ?? this.action,
    );
  }

}

class AreaModalNotifier extends StateNotifier<AreaModal> {

  AreaModalNotifier() : super(AreaModal());

  void setActionPlatform(PlatformModel? platform) {
    state = state.copyWith(actionPlatform: platform);
  }

  void setTrigger(TriggerModel? trigger) {
    state = state.copyWith(trigger: trigger);
  }

  void setReactionPlatform(PlatformModel? platform) {
    state = state.copyWith(reactionPlatform: platform);
  }

  void setAction(ActionModel? action) {
    state = state.copyWith(action: action);
  }

}
