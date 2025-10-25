import 'package:area/core/constant/constants.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AppSettingsModel {

  String apiUrl;
  String apiPort;

  AppSettingsModel({
    required this.apiUrl,
    required this.apiPort
  });

  String get fullUrl => "$apiUrl:$apiPort";

  Future<void> saveSettings({
    required String apiUrl,
    required String apiPort
  }) async {
    final sharedPreferences = await SharedPreferences.getInstance();

    print("Saving settings : $apiUrl, $apiPort");

    this.apiUrl = apiUrl;
    this.apiPort = apiPort;
    sharedPreferences.setString(Constants.apiUrlKey, apiUrl);
    sharedPreferences.setString(Constants.apiPortKey, apiPort);
  }

}
