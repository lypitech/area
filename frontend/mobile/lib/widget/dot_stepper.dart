import 'package:flutter/material.dart';

class DotStepper extends StatelessWidget {

  static const double size = 6;

  final int amount;
  final int index;

  const DotStepper({
    required this.amount,
    required this.index,
    super.key
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      spacing: 6,
      children: List.generate(
        amount,
        (int index) {
          Color dotColor = Color(0XFF28282B);

          if (index >= this.index) {
            dotColor = dotColor.withOpacity(.3); // TODO: Use Color#withAlpha(int).
          }

          return Container(
            width: size,
            height: size,
            decoration: BoxDecoration(
              color: dotColor,
              borderRadius: BorderRadius.circular(size / 2)
            ),
          );
        }
      ),
    );
  }

}
