import 'package:flutter/material.dart';

class DialogButton extends StatefulWidget {

  final DialogButtonStyle style;
  final String text;
  final VoidCallback onTap;

  const DialogButton({
    super.key,

    required this.style,
    required this.text,
    required this.onTap
  });

  @override
  State<DialogButton> createState() => _DialogButtonState();

}

class _DialogButtonState extends State<DialogButton> {

  double _scale = 1;

  @override
  Widget build(BuildContext context) {
    Color color = widget.style == DialogButtonStyle.primary
      ? Theme.of(context).colorScheme.primary
      : Colors.transparent;

    return AnimatedScale(
      scale: _scale,
      duration: const Duration(milliseconds: 50),
      curve: Curves.easeIn,
      child: Material(
        elevation: widget.style == DialogButtonStyle.primary ? 5 : 0,
        color: color,
        borderRadius: BorderRadius.circular(20),
        child: InkWell(
          onTap: () => widget.onTap(),
          onTapDown: (_) {
            setState(() => _scale = 0.95);
          },
          onTapUp: (_) {
            setState(() => _scale = 1);
          },
          onTapCancel: () {
            setState(() => _scale = 1);
          },
          borderRadius: BorderRadius.circular(20.0),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 15, horizontal: 40),
            child: Text(
              widget.text,
              style: TextStyle(
                color: widget.style == DialogButtonStyle.primary
                  ? Colors.white
                  : Colors.grey,
                fontWeight: widget.style == DialogButtonStyle.primary
                  ? FontWeight.w600
                  : FontWeight.w400,
                fontSize: 16
              ),
              textAlign: TextAlign.center,
            ),
          )
        )
      )
    );
  }
}

enum DialogButtonStyle {
  primary,
  secondary
}
