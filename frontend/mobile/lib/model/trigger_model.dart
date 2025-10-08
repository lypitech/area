import 'package:area/core/constant/constants.dart';

class TriggerModel {

  final String uuid;
  final String name;
  final String description;
  final List<String> requiredParams;

  TriggerModel({
    required this.uuid,
    required this.name,
    required this.description,
    this.requiredParams = const [],
  });

  factory TriggerModel.fromJson(JsonData json) {
    return TriggerModel(
      uuid: json['uuid'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      requiredParams: List<String>.from(json['requiredParams'] ?? const []),
    );
  }

  JsonData toJson() => {
    'uuid': uuid,
    'name': name,
    'description': description,
    'requiredParams': requiredParams,
  };

}
