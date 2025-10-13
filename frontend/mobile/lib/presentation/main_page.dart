import 'package:area/data/provider/main_page_route_provider.dart';
import 'package:area/presentation/main/discover_page.dart';
import 'package:area/presentation/main/home_page.dart';
import 'package:area/presentation/main/my_areas_page.dart';
import 'package:area/presentation/main/profile_page.dart';
import 'package:area/widget/a_navbar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class MainPage extends ConsumerWidget {

  MainPage({
    super.key
  });

  final Map<String, Widget> _router = {
    'home': HomePage(),
    'discover': DiscoverPage(),
    'myareas': MyAreasPage(),
    'profile': ProfilePage(),
  };

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentRoute = ref.watch(mainPageRouteProvider);

    return Scaffold(
      extendBody: true,
      bottomNavigationBar: ANavbar(),
      body: _router[currentRoute],
    );
  }

}
