import 'package:flutter/material.dart';

class Logo extends StatelessWidget {

  static const double defaultSize = 72;
  static const double borderRadius = 20;
  static const String iconPath = 'assets/image/AREA_1024.png';

  final double size;

  const Logo({
    this.size = defaultSize,
    super.key
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(borderRadius),
        boxShadow: <BoxShadow>[
          // ...
        ],
        image: DecorationImage(
          fit: BoxFit.cover,
          isAntiAlias: true,
          image: AssetImage(iconPath)
        )
      ),
    );
  }

}
