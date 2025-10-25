import 'package:area/core/constant/constants.dart';
import 'package:area/model/app_settings_model.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// TODO: Maybe check validity of api url & port from SharedPreferences storage
/// on load, as a user can modify it without app's front-end?
final appSettingsProvider =
  AsyncNotifierProvider<AppSettingsNotifier, AppSettingsModel>(
    AppSettingsNotifier.new,
  );

class AppSettingsNotifier extends AsyncNotifier<AppSettingsModel> {
  @override
  Future<AppSettingsModel> build() async {
    final sharedPreferences = await SharedPreferences.getInstance();

    final apiUrl = sharedPreferences.getString(Constants.apiUrlKey)
      ?? dotenv.env['API_URL']!;
    final apiPort = sharedPreferences.getString(Constants.apiPortKey)
      ?? dotenv.env['API_PORT']!;

    return AppSettingsModel(
      apiUrl: apiUrl,
      apiPort: apiPort
    );
  }

  Future<void> saveSettings({
    required String apiUrl,
    required String apiPort,
  }) async {
    state = const AsyncValue.loading();

    try {
      final sharedPreferences = await SharedPreferences.getInstance();

      await sharedPreferences.setString(Constants.apiUrlKey, apiUrl);
      await sharedPreferences.setString(Constants.apiPortKey, apiPort);

      final newModel = AppSettingsModel(
        apiUrl: apiUrl,
        apiPort: apiPort
      );

      state = AsyncValue.data(newModel);
    } catch (error, state_) {
      state = AsyncValue.error(error, state_);
      rethrow;
    }
  }

  Future<void> updateApiUrl(String apiUrl) async {
    final current = state.value ?? await build();

    await saveSettings(
      apiUrl: apiUrl,
      apiPort: current.apiPort
    );
  }

}
