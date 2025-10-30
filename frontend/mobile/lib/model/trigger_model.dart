import 'package:area/core/constant/constants.dart';
import 'package:area/model/parameter_model.dart';

class TriggerModel {

  final String uuid;
  final String name;
  final String description;
  final List<ParameterModel> requiredParams;

  TriggerModel({
    required this.uuid,
    required this.name,
    required this.description,
    this.requiredParams = const [],
  });

  factory TriggerModel.fromJson(JsonData json) {
    // final requiredParams = (json['parameters'] ?? []) as List<dynamic>;

    final requiredParams = [
      ParameterModel(
        name: 'crampter',
        type: 'int',
        description: 'o sucre'
      ).toJson()
    ];

    return TriggerModel(
      uuid: json['uuid'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      requiredParams: requiredParams
        .map((e) => ParameterModel.fromJson(JsonData.from(e)))
        .toList()
    );
  }

  JsonData toJson() => {
    'uuid': uuid,
    'name': name,
    'description': description,
    'parameters': requiredParams.map((e) => e.toJson()).toList(),
  };

}
