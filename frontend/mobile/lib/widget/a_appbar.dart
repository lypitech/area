import 'package:area/widget/appbar_button.dart';
import 'package:flutter/material.dart';

class AAppbar extends StatelessWidget implements PreferredSizeWidget {

  static const double size = 82;

  final AppbarButton? leading;
  final List<Widget>? trailing;

  const AAppbar({
    this.leading,
    this.trailing,
    super.key
  });

  @override
  Widget build(BuildContext context) {
    return AppBar(
      leading: leading,
      actions: trailing,
      title: Padding(
        padding: const EdgeInsets.all(20),
        child: Container(
          width: 64,
          height: 64,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                offset: Offset(0, 4),
                blurRadius: 4,
                color: Colors.black.withOpacity(.15)
              )
            ],
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
