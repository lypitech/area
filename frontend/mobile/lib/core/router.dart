import 'package:area/core/constant/constants.dart';
import 'package:area/model/area_model.dart';
import 'package:area/model/parameter_model.dart';
import 'package:area/model/platform_model.dart';
import 'package:area/model/user_model.dart';
import 'package:area/presentation/auth/login_page.dart';
import 'package:area/presentation/auth/registration/register_page.dart';
import 'package:area/presentation/error_page.dart';
import 'package:area/presentation/init_page.dart';
import 'package:area/presentation/main/area_details_page.dart';
import 'package:area/presentation/main/settings/settings_page.dart';
import 'package:area/presentation/main_page.dart';
import 'package:area/presentation/new_area/choose_platform_page.dart';
import 'package:area/presentation/new_area/choose_trigger_action_page.dart';
import 'package:area/presentation/new_area/new_area_page.dart';
import 'package:area/presentation/new_area/parameter_input_page.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/init',
    errorBuilder: (_, __) => ErrorPage(),
    redirect: (context, state) {
      final uri = state.uri;
      if (uri.scheme == Constants.oAuthUrlScheme) {
        return '/';
      }
      return null;
    },
    routes: [
      // ---------- INIT ----------
      GoRoute(
        name: 'init',
        path: '/init',
        builder: (_, __) => InitPage(),
      ),

      // ---------- AUTH ----------
      GoRoute(
        name: 'login',
        path: '/login',
        builder: (_, __) => LoginPage(),
      ),
      GoRoute(
        name: 'register',
        path: '/register',
        builder: (_, __) => RegisterPage(),
      ),

      // ---------- MAIN ----------
      GoRoute(
        path: '/',
        builder: (_, __) => MainPage(),
        routes: [
          GoRoute(
            name: 'new_area',
            path: 'new_area',
            builder: (_, __) => NewAreaPage(),
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
                    routes: [
                      GoRoute(
                        name: 'parameter_input',
                        path: 'parameters',
                        builder: (_, state) {
                          final extra = state.extra as Map<String, dynamic>;
                          final parameters = extra['parameters'] as List<ParameterModel>;
                          final name = extra['name'] as String;
                          final isAction = extra['isAction'] as bool;
                          final requiresPayload = extra['requiresPayload'] as bool? ?? false;

                          return ParameterInputPage(
                            parameters: parameters,
                            triggerOrActionName: name,
                            isAction: isAction,
                            requiresPayload: requiresPayload,
                          );
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
          GoRoute(
            name: 'area_details',
            path: 'area_details',
            builder: (_, state) {
              return AreaDetailsPage(
                area: state.extra as AreaModel
              );
            },
          ),
          GoRoute(
            name: 'settings',
            path: 'settings',
            builder: (_, state) {
              return SettingsPage(
                user: state.extra as UserModel
              );
            }
          )
        ],
      ),
    ],
  );
});
