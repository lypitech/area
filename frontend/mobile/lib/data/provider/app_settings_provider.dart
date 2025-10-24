import 'package:area/model/app_settings_model.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

final appSettingsProvider = FutureProvider<AppSettingsModel>((ref) async {
  final sharedPreferences = await SharedPreferences.getInstance();

  final apiUrl = sharedPreferences.getString('AREA_API_URL') ?? dotenv.env['API_URL']!;
  final apiPort = sharedPreferences.getString('AREA_API_PORT') ?? dotenv.env['API_PORT']!;

  return AppSettingsModel(
    apiUrl: apiUrl,
    apiPort: apiPort
  );
});
