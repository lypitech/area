import 'package:area/data/provider/auth_provider.dart';
import 'package:area/data/provider/main_page_route_provider.dart';
import 'package:area/presentation/main/my_areas_page.dart';
import 'package:area/presentation/main/profile_page.dart';
import 'package:area/widget/a_navbar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class MainPage extends ConsumerWidget {

  const MainPage({
    super.key
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentRoute = ref.watch(mainPageRouteProvider);
    final authNotifierAsync = ref.watch(authNotifierProvider);

    return authNotifierAsync.when(
      data: (authNotifier) {
        final user = authNotifier.getUser();

        if (user == null) {
          context.go('/login');
          return Container();
        }

        final Widget body = switch (currentRoute) {
          'myareas' => MyAreasPage(user: user),
          'profile' => ProfilePage(user: user),
          String() => throw UnimplementedError(),
        };

        return Scaffold(
          extendBody: true,
          bottomNavigationBar: ANavbar(),
          body: body,
        );
      },
      error: (err, _) {
        return Center(
          child: Text('Error: $err')
        );
      },
      loading: () {
        return CircularProgressIndicator();
      }
    );
  }

}
