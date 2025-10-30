import 'package:area/model/action_model.dart';
import 'package:area/model/platform_model.dart';
import 'package:area/model/trigger_model.dart';
import 'package:flutter_riverpod/legacy.dart';

class AreaModal {

  String? title;
  PlatformModel? actionPlatform;
  TriggerModel? trigger;
  Map<String, dynamic>? triggerParameters;
  PlatformModel? reactionPlatform;
  ActionModel? action;
  Map<String, dynamic>? actionParameters;

  AreaModal({
    this.title,
    this.actionPlatform,
    this.trigger,
    this.triggerParameters,
    this.reactionPlatform,
    this.action,
    this.actionParameters
  });

  AreaModal copyWith({
    String? title,
    PlatformModel? actionPlatform,
    TriggerModel? trigger,
    Map<String, dynamic>? triggerParameters,
    PlatformModel? reactionPlatform,
    ActionModel? action,
    Map<String, dynamic>? actionParameters,
  }) {
    return AreaModal(
      title: title ?? this.title,
      actionPlatform: actionPlatform ?? this.actionPlatform,
      trigger: trigger ?? this.trigger,
      triggerParameters: triggerParameters ?? this.triggerParameters,
      reactionPlatform: reactionPlatform ?? this.reactionPlatform,
      action: action ?? this.action,
      actionParameters: actionParameters ?? this.actionParameters,
    );
  }

  bool isComplete() {
    final hasBasicInfo =
      title != null
      && title!.isNotEmpty
      && actionPlatform != null
      && trigger != null
      && reactionPlatform != null
      && action != null;

    if (!hasBasicInfo) {
      return false;
    }

    if (trigger!.requiredParams.isNotEmpty &&
        (triggerParameters == null || triggerParameters!.isEmpty)) {
      return false;
    }

    if (action!.requiredParams.isNotEmpty &&
        (actionParameters == null || actionParameters!.isEmpty)) {
      return false;
    }

    return true;
  }
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
    state = state.copyWith(
      trigger: trigger,
      triggerParameters: {}
    );
  }

  void setTriggerParameters(Map<String, dynamic>? parameters) {
    state = state.copyWith(triggerParameters: parameters);
  }

  void setReactionPlatform(PlatformModel? platform) {
    state = state.copyWith(reactionPlatform: platform);
  }

  void setAction(ActionModel? action) {
    state = state.copyWith(
      action: action,
      actionParameters: {},
    );
  }

  void setActionParameters(Map<String, dynamic>? parameters) {
    state = state.copyWith(actionParameters: parameters);
  }
}
