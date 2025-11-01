class AppSettingsModel {

  String apiUrl;
  String apiPort;

  AppSettingsModel({
    required this.apiUrl,
    required this.apiPort
  });

  String get fullUrl {
    final url = apiUrl.trim();
    final port = apiPort.trim();

    if (port.isEmpty) {
      return url;
    }

    if (url.endsWith(':$port')) {
      return url;
    }
    return '$url:$port';
  }

  bool equals(String url, String port) {
    return apiUrl == url && apiPort == port;
  }

}
