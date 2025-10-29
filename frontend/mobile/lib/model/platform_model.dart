import 'package:area/core/constant/constants.dart';
import 'package:area/model/action_model.dart';
import 'package:area/model/trigger_model.dart';

class PlatformModel {

  final String uuid;
  final String name;
  final String? iconBase64;
  final List<TriggerModel> triggers;
  final List<ActionModel> actions;

  PlatformModel({
    required this.uuid,
    required this.name,
    this.iconBase64,
    this.triggers = const [],
    this.actions = const [],
  });

  factory PlatformModel.fromJson(JsonData json) {
    return PlatformModel(
      uuid: json['uuid'] as String,
      name: json['name'] as String,
      iconBase64: json['iconBase64'] as String?,
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
    'iconBase64': iconBase64,
    'actions': triggers.map((t) => t.toJson()).toList(),
    'reactions': actions.map((a) => a.toJson()).toList(),
  };

}
