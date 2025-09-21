import 'package:area/feature/presentation/auth/login_page.dart';
import 'package:area/feature/presentation/error_page.dart';
import 'package:area/feature/presentation/main_page.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    errorBuilder: (_, _) {
      return ErrorPage();
    },
    redirect: (_, _) {
      final isAuthenticated = false; // TODO: Real condition

      if (!isAuthenticated) {
        return '/login';
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
