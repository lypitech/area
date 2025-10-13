import 'package:area/data/provider/hive_box_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/adapters.dart';
import 'app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await dotenv.load(fileName: '.env');
  if (!dotenv.env.containsKey('API_URL') || !dotenv.env.containsKey('API_PORT')) {
    String errorMessage = 'Please specify the following fields in the environment variables (.env file):';
    errorMessage += '\n- API_URL';
    errorMessage += '\n- API_PORT';
    print(errorMessage);
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
