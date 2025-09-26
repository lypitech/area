import 'package:area/data/provider/auth_state_provider.dart';
import 'package:area/presentation/auth/login_page.dart';
import 'package:area/presentation/auth/registration/register_page.dart';
import 'package:area/presentation/error_page.dart';
import 'package:area/presentation/main_page.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    errorBuilder: (_, _) {
      return ErrorPage();
    },
    redirect: (_, GoRouterState state) {
      final loggedIn = ref.watch(authStateProvider);

      if (loggedIn == null) {
        return null;
      }
      if (!loggedIn && state.matchedLocation != '/login') {
        return '/login';
      }
      if (loggedIn && state.matchedLocation == '/login') {
        return '/';
      }
      return null;
    },
    routes: <GoRoute>[
      GoRoute(
        path: '/',
        builder: (_, _) {
          return MainPage();
        },
        routes: [
          GoRoute(
            path: 'login',
            builder: (_, _) {
              return LoginPage();
            },
          ),
          GoRoute(
            path: 'register',
            builder: (_, _) {
              return RegisterPage();
            },
          ),
        ],
      ),
    ],
  );
});
