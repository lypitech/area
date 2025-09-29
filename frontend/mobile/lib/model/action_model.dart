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

}
