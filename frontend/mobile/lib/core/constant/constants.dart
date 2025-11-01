typedef JsonData = Map<String, dynamic>;

class Constants {

  static const String appName = 'Area';

  static const String oAuthUrlScheme = 'fr.lypitech.area';
  static const String oAuthBaseUrl = '$oAuthUrlScheme://oauth-callback';

  static const String hiveCacheName = 'area_cache';

  static const String apiUrlKey = 'AREA_API_URL';
  static const String apiPortKey = 'AREA_API_PORT';

  static const String envApiUrlKey = 'DEFAULT_API_URL';
  static const String envApiPortKey = 'DEFAULT_API_PORT';
  static const String envGithubClientIdKey = 'GITHUB_CLIENT_ID';
  static const String envTwitchClientIdKey = 'TWITCH_CLIENT_ID';

}
