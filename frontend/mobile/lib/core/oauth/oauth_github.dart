import 'package:area/core/constant/constants.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_web_auth_2/flutter_web_auth_2.dart';

Future<String> githubSignIn() async {
  final redirectUri = '${Constants.oAuthBaseUrl}/github';
  final authUrl = Uri(
    scheme: 'https',
    host: 'github.com',
    path: '/login/oauth/authorize',
    queryParameters: {
      'client_id': dotenv.env['GITHUB_CLIENT_ID']!,
      'redirect_uri': redirectUri,
      'scope': 'repo admin:repo_hook admin:org_hook admin:public_key workflow write:packages delete:packages read:user read:org user:email user',
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
