import 'package:area/data/provider/auth_provider.dart';
import 'package:area/model/platform_model.dart';
import 'package:area/presentation/auth/login_page.dart';
import 'package:area/presentation/auth/registration/register_page.dart';
import 'package:area/presentation/error_page.dart';
import 'package:area/presentation/init_page.dart';
import 'package:area/presentation/main_page.dart';
import 'package:area/presentation/new_area/choose_platform_page.dart';
import 'package:area/presentation/new_area/choose_trigger_action_page.dart';
import 'package:area/presentation/new_area/new_area_page.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/init',
    errorBuilder: (_, _) => ErrorPage(),
    routes: [
      // ---------- INIT ----------
      GoRoute(
        name: 'init',
        path: '/init',
        builder: (_, _) => InitPage(),
      ),

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
