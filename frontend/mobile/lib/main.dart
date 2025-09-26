import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
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

  runApp(
    ProviderScope(
      child: const App()
    )
  );
}
