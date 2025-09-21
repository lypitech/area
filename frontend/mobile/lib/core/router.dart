import 'package:area/data/provider/auth_state_provider.dart';
import 'package:area/presentation/auth/login_page.dart';
import 'package:area/presentation/error_page.dart';
import 'package:area/presentation/main_page.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/login',
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
        return '/home';
      }
      return null;
    },
    routes: <GoRoute>[
      GoRoute(
        path: '/login',
        builder: (_, _) {
          return LoginPage();
        }
      ),
      // register
      GoRoute(
        path: '/home',
        builder: (_, _) {
          return MainPage();
        }
      )
    ]
  );
});
