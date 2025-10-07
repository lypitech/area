import 'package:area/core/constant/constants.dart';

class ActionModel {

  final String uuid;
  final String name;
  final String description;
  final List<String> requiredParams;

  ActionModel({
    required this.uuid,
    required this.name,
    required this.description,
    this.requiredParams = const [],
  });

  factory ActionModel.fromJson(JsonData json) {
    return ActionModel(
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
