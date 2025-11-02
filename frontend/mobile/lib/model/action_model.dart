import 'package:area/core/constant/constants.dart';
import 'package:area/model/parameter_model.dart';

class ActionModel {

  final String uuid;
  final String name;
  final String description;
  final List<ParameterModel> requiredParams;
  final bool isPayloadRequired;

  ActionModel({
    required this.uuid,
    required this.name,
    required this.description,
    this.requiredParams = const [],
    this.isPayloadRequired = true
  });

  factory ActionModel.fromJson(JsonData json) {
    final requiredParams = (json['parameters'] ?? []) as List<dynamic>;

    return ActionModel(
      uuid: json['uuid'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      requiredParams: requiredParams
        .map((e) => ParameterModel.fromJson(JsonData.from(e)))
        .toList(),
      isPayloadRequired: json['requires_payload'] as bool? ?? false
    );
  }

  JsonData toJson() => {
    'uuid': uuid,
    'name': name,
    'description': description,
    'parameters': requiredParams.map((e) => e.toJson()).toList(),
    'requires_payload': isPayloadRequired
  };

}
