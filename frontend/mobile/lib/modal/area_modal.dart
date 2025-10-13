import 'package:area/model/action_model.dart';
import 'package:area/model/platform_model.dart';
import 'package:area/model/trigger_model.dart';
import 'package:flutter_riverpod/legacy.dart';

class AreaModal {

  String? title;
  PlatformModel? actionPlatform;
  TriggerModel? trigger;
  PlatformModel? reactionPlatform;
  ActionModel? action;

  AreaModal({
    this.title,
    this.actionPlatform,
    this.trigger,
    this.reactionPlatform,
    this.action
  });

  AreaModal copyWith({
    String? title,
    PlatformModel? actionPlatform,
    TriggerModel? trigger,
    PlatformModel? reactionPlatform,
    ActionModel? action,
  }) {
    return AreaModal(
      title: title ?? this.title,
      actionPlatform: actionPlatform ?? this.actionPlatform,
      trigger: trigger ?? this.trigger,
      reactionPlatform: reactionPlatform ?? this.reactionPlatform,
      action: action ?? this.action,
    );
  }

  bool isComplete() {
    return title != null
      && title!.isNotEmpty
      && actionPlatform != null
      && trigger != null
      && reactionPlatform != null
      && action != null;
  }

}

class AreaModalNotifier extends StateNotifier<AreaModal> {

  AreaModalNotifier() : super(AreaModal());

  void setTitle(String? title) {
    state = state.copyWith(title: title);
  }

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
