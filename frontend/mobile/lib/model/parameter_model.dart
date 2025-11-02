import 'package:area/core/constant/constants.dart';

class ParameterModel {

  final String name;
  final String type;
  final String description;

  ParameterModel({
    required this.name,
    required this.type,
    required this.description,
  });

  factory ParameterModel.fromJson(JsonData json) {
    return ParameterModel(
      name: json['name'] ?? '',
      type: json['type'] ?? '',
      description: json['description'] ?? ''
    );
  }

  JsonData toJson() {
    return {
      'name': name,
      'type': type,
      'description': description
    };
  }

}
