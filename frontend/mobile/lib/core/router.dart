import 'package:area/data/provider/auth_provider.dart';
import 'package:area/model/platform_model.dart';
import 'package:area/presentation/auth/login_page.dart';
import 'package:area/presentation/auth/registration/register_page.dart';
import 'package:area/presentation/error_page.dart';
import 'package:area/presentation/main_page.dart';
import 'package:area/presentation/new_area/choose_platform_page.dart';
import 'package:area/presentation/new_area/choose_trigger_action_page.dart';
import 'package:area/presentation/new_area/new_area_page.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    errorBuilder: (_, _) => ErrorPage(),
    redirect: (_, state) {
      final loggedIn = ref.watch(authStateProvider);

      if (loggedIn == null) {
        return null;
      }

      // Not logged in: send to login page
      if (!loggedIn && state.matchedLocation != '/login') {
        return '/login';
      }

      // Already logged in: redirect to homepage
      if (loggedIn && state.matchedLocation == '/login') {
        return '/';
      }

      return null;
    },
    routes: [
      // ---------- AUTH ----------
      GoRoute(
        name: 'login',
        path: '/login',
        builder: (_, _) => LoginPage(),
      ),
      GoRoute(
        name: 'register',
        path: '/register',
        builder: (_, _) => RegisterPage(),
      ),

      // ---------- MAIN ----------
      GoRoute(
        path: '/',
        builder: (_, _) => MainPage(),
        routes: [
          GoRoute(
            name: 'new_area',
            path: 'new_area',
            builder: (_, _) => NewAreaPage(),
            routes: [
              GoRoute(
                name: 'choose_platform',
                path: 'choose_platform/:mode',
                builder: (_, state) {
                  final mode = switch (state.pathParameters['mode']) {
                    'action' => ChoosePlatformPageMode.triggers,
                    'reaction' => ChoosePlatformPageMode.actions,
                    _ => throw UnimplementedError(),
                  };

                  return ChoosePlatformPage(mode: mode);
                },
                routes: [
                  GoRoute(
                    name: 'choose_trigger_action',
                    path: 'choose',
                    builder: (_, state) {
                      final mode = switch (state.pathParameters['mode']) {
                        'action' => ChoosePlatformPageMode.triggers,
                        'reaction' => ChoosePlatformPageMode.actions,
                        _ => throw UnimplementedError(),
                      };

                      return ChooseTriggerActionPage(
                        platform: state.extra as PlatformModel,
                        mode: mode,
                      );
                    },
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
});
