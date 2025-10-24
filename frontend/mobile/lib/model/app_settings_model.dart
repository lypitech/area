class AppSettingsModel {

  String apiUrl;
  String apiPort;

  AppSettingsModel({
    required this.apiUrl,
    required this.apiPort
  });

  String get fullUrl => "$apiUrl:$apiPort";

}
