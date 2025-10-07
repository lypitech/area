import 'package:area/core/constant/constants.dart';
import 'package:area/model/action_model.dart';
import 'package:area/model/trigger_model.dart';

class PlatformModel {

  final String uuid;
  final String name;
  final String iconBase64;
  final List<TriggerModel> triggers;
  final List<ActionModel> actions;

  PlatformModel({
    required this.uuid,
    required this.name,
    this.iconBase64 = '',
    this.triggers = const [],
    this.actions = const [],
  });

  factory PlatformModel.fromJson(JsonData data) {
    return PlatformModel(
      uuid: data['uuid'] as String,
      name: data['name'] as String,
      iconBase64: data['iconBase64'] as String? ?? '',
      triggers: (data['triggers'] as List<dynamic>?)
          ?.map((e) => TriggerModel.fromJson(Map<String, dynamic>.from(e)))
          .toList()
        ?? [],
      actions: (data['actions'] as List<dynamic>?)
          ?.map((e) => ActionModel.fromJson(Map<String, dynamic>.from(e)))
          .toList()
        ?? [],
    );
  }

  JsonData toJson() => {
    'uuid': uuid,
    'name': name,
    'iconBase64': iconBase64,
    'triggers': triggers.map((t) => t.toJson()).toList(),
    'actions': actions.map((a) => a.toJson()).toList(),
  };

}
