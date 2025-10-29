import 'package:area/core/constant/constants.dart';
import 'package:area/data/provider/hive_box_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:hive_flutter/adapters.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'app.dart';

Future<bool> initAppSettings() async {
  final requiredEnvVariables = [
    Constants.envApiUrlKey,
    Constants.envApiPortKey,
    Constants.envGithubClientIdKey,
    Constants.envGithubClientSecretKey
  ];


  for (String k in requiredEnvVariables) {
    if (!dotenv.env.containsKey(k)) {
      Fluttertoast.showToast(
        msg: 'This build is broken. Default environment variables are not specified.'
      );
      return false;
    }
  }

  final sharedPreferences = await SharedPreferences.getInstance();

  if (!sharedPreferences.containsKey(Constants.apiUrlKey)) {
    sharedPreferences.setString(
      Constants.apiUrlKey,
      dotenv.env[Constants.envApiUrlKey]!
    );
  }

  if (!sharedPreferences.containsKey(Constants.apiPortKey)) {
    sharedPreferences.setString(
      Constants.apiPortKey,
      dotenv.env[Constants.envApiPortKey]!
    );
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
  final hiveBox = await Hive.openBox(Constants.hiveCacheName);

  runApp(
    ProviderScope(
      overrides: [
        hiveBoxProvider.overrideWithValue(hiveBox)
      ],
      child: const App()
    )
  );
}
