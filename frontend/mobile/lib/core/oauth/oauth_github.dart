import 'package:area/core/constant/constants.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_web_auth_2/flutter_web_auth_2.dart';

Future<String?> githubSignIn() async {
  final authUrl = Uri(
    scheme: 'https',
    host: 'github.com',
    path: '/login/oauth/authorize',
    queryParameters: {
      'client_id': dotenv.env['GITHUB_CLIENT_ID']!,
      'redirect_uri': '${Constants.oAuthBaseUrl}/github',
      'scope': 'read:user user:email',
    },
  ).toString();

  try {
    final result = await FlutterWebAuth2.authenticate(
      url: authUrl,
      callbackUrlScheme: Constants.oAuthUrlScheme,
      options: FlutterWebAuth2Options(
        preferEphemeral: false,
      )
    );

    final code = Uri.parse(result).queryParameters['code'];

    return code;
  } catch (error) { // User cancelled oauth
    // ...
    return null;
  }
}
