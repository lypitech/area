import 'package:area/core/constant/constants.dart';
import 'package:area/data/provider/hive_box_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/adapters.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'app.dart';

Future<bool> initAppSettings() async {
  if (!dotenv.env.containsKey('API_URL') || !dotenv.env.containsKey('API_PORT')) {
    print('This build is broken. Default API URL and port are not specified.');
    return false;
  }

  final sharedPreferences = await SharedPreferences.getInstance();

  if (!sharedPreferences.containsKey(Constants.apiUrlKey)) {
    sharedPreferences.setString(Constants.apiUrlKey, dotenv.env['API_URL']!);
  }

  if (!sharedPreferences.containsKey(Constants.apiPortKey)) {
    sharedPreferences.setString(Constants.apiPortKey, dotenv.env['API_PORT']!);
  }

  return true;
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await dotenv.load(fileName: '.env');

  if (!(await initAppSettings())) {
    return;
  }

  await Hive.initFlutter();
  final hiveBox = await Hive.openBox('area_cache');

  runApp(
    ProviderScope(
      overrides: [
        hiveBoxProvider.overrideWithValue(hiveBox)
      ],
      child: const App()
    )
  );
}
