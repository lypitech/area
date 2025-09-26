import 'dart:ui';

import 'package:area/data/provider/main_page_route_provider.dart';
import 'package:area/icon/area_icons.dart';
import 'package:area/model/navbar_element_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class ANavbar extends ConsumerStatefulWidget {

  const ANavbar({
    super.key
  });

  @override
  ConsumerState<ANavbar> createState() => _ANavbarState();

}

class _ANavbarState extends ConsumerState<ANavbar> {

  final List<NavbarElementModel> _navbarElements = [
    NavbarElementModel(
      icon: Icons.home_outlined,
      iconEnabled: Icons.home,
      title: 'Home',
      route: 'home'
    ),
    NavbarElementModel(
      icon: AreaIcons.compass_outline,
      iconEnabled: AreaIcons.compass,
      title: 'Discover',
      route: 'discover'
    ),
    NavbarElementModel(
      icon: Icons.add_box_outlined,
      iconEnabled: Icons.add_box,
      title: 'Add AREA',
      route: '/newarea'
    ),
    NavbarElementModel(
      icon: Icons.list_alt_rounded,
      iconEnabled: Icons.view_list,
      title: 'My AREAs',
      route: 'myareas'
    ),
    NavbarElementModel(
      icon: Icons.person_outline_rounded,
      iconEnabled: Icons.person_rounded,
      title: 'My profile',
      route: 'profile'
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final mainPageRoute = ref.read(mainPageRouteProvider);

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(28),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
            child: Container(
              height: 64,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(28),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                spacing: 5,
                children: _navbarElements
                  .map((e) {
                    final icon = mainPageRoute == e.route
                      ? e.iconEnabled
                      : e.icon;

                    return Tooltip(
                      message: e.title,
                      child: InkWell(
                        onTap: () {
                          final route = e.route;

                          if (route.startsWith('/')) {
                            context.push(route);
                            return;
                          }
                          ref.read(mainPageRouteProvider.notifier).state = route;
                        },
                        borderRadius: BorderRadius.circular(24),
                        child: Padding(
                          padding: const EdgeInsets.all(12),
                          child: Icon(icon),
                        ),
                      ),
                    );
                  })
                  .toList(),
              ),
            ),
          ),
        ),
      ),
    );
  }

}
