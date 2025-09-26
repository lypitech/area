import 'package:flutter/cupertino.dart';

class NavbarElementModel {

  final IconData icon;
  final IconData iconEnabled;
  final String title;
  final String route;

  const NavbarElementModel({
    required this.icon,
    required this.iconEnabled,
    required this.title,
    required this.route,
  });

}