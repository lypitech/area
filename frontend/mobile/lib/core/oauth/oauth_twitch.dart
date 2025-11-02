import 'package:area/core/constant/constants.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_web_auth_2/flutter_web_auth_2.dart';

Future<String> twitchSignIn() async {
  final redirectUri = '???';
  final authUrl = Uri(
    scheme: 'https',
    host: 'id.twitch.tv',
    path: '/oauth2/authorize',
    queryParameters: {
      'client_id': dotenv.env['TWITCH_CLIENT_ID']!,
      'redirect_uri': redirectUri,
      'response_type': 'code',
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

    if (code == null) {
      throw Exception('Code is null.');
    }

    return code;
  } catch (error) {
    return 'AR3AERR:$error';
  }
}
