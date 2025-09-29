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

}
