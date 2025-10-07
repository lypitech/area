import 'package:area/core/constant/constants.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:github_oauth/github_oauth.dart';

final githubOAuthProvider = Provider<GitHubSignIn>((ref) {
  return GitHubSignIn(
    clientId: dotenv.env['GITHUB_CLIENT_ID']!,
    clientSecret: dotenv.env['GITHUB_CLIENT_SECRET']!,
    redirectUrl: "${Constants.oAuthBaseUrl}/github"
  );
});
