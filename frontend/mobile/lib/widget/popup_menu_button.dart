import 'package:flutter/material.dart';

class AppbarPopupMenuButton extends StatelessWidget {

  const AppbarPopupMenuButton({
    super.key
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Material(
        elevation: 4,
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        child: const Padding(
          padding: EdgeInsets.all(10),
          child: Center(
            child: Icon(
              Icons.more_vert_rounded,
            ),
          )
        )
      ),
    );
  }

}
