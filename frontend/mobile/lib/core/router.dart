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
    routes: <GoRoute>[
      GoRoute(
        path: '/',
        builder: (_, _) {
          return MainPage();
        }
      )
    ]
  );
});
