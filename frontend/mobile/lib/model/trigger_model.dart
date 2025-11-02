import 'package:area/core/constant/constants.dart';
import 'package:area/model/parameter_model.dart';

class TriggerModel {

  final String uuid;
  final String name;
  final String description;
  final List<ParameterModel> requiredParams;
  final String type;

  TriggerModel({
    required this.uuid,
    required this.name,
    required this.description,
    this.requiredParams = const [],
    required this.type,
  });

  factory TriggerModel.fromJson(JsonData json) {
    final requiredParams = (json['parameters'] ?? []) as List<dynamic>;

    String triggerType = json['trigger_type'] ?? '';

    if (triggerType.isEmpty) {
      final List rawTriggerTypes = json['trigger_types'] ?? [];
      if (rawTriggerTypes.isEmpty) {
        triggerType = 'webhook';
      }
      triggerType = rawTriggerTypes[0];
      triggerType = triggerType.toLowerCase();
    }

    return TriggerModel(
      uuid: json['uuid'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      requiredParams: requiredParams
        .map((e) => ParameterModel.fromJson(JsonData.from(e)))
        .toList(),
      type: triggerType
    );
  }

  JsonData toJson() => {
    'uuid': uuid,
    'name': name,
    'description': description,
    'parameters': requiredParams.map((e) => e.toJson()).toList(),
    'trigger_type': type
  };

}
