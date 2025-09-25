import 'package:area/widget/appbar_button.dart';
import 'package:flutter/material.dart';

class AAppbar extends StatelessWidget implements PreferredSizeWidget {

  static const double size = 82;

  final AppbarButton? leading;

  const AAppbar({
    this.leading,
    super.key
  });

  @override
  Widget build(BuildContext context) {
    return AppBar(
      leading: leading,
      title: Padding(
        padding: const EdgeInsets.all(20),
        child: Container(
          width: 64,
          height: 64,
          decoration: BoxDecoration(
            image: DecorationImage(
              image: AssetImage('assets/image/AREA_1024.png')
            )
          ),
        ),
      ),
      leadingWidth: size,
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(size);

}
