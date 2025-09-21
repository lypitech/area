import 'package:flutter/material.dart';

class ClickableFrame extends StatefulWidget {

  final VoidCallback? onTap;
  final Widget child;

  const ClickableFrame({
    this.onTap,
    required this.child,
    super.key
  });

  @override
  State<ClickableFrame> createState() => _ClickableFrameState();

}

class _ClickableFrameState extends State<ClickableFrame> {

  double _scale = 1;

  @override
  Widget build(BuildContext context) {
    return AnimatedScale(
      scale: _scale,
      duration: const Duration(milliseconds: 100),
      curve: Curves.easeInOut,
      child: Material(
        color: Colors.white,
        shadowColor: Colors.black,
        elevation: 8,
        borderRadius: BorderRadius.circular(20),
        child: InkWell(
          onTapDown: (_) {
            setState(() => _scale = 0.95);
          },
          onTapUp: (_) {
            setState(() => _scale = 1);
          },
          onTapCancel: () {
            setState(() => _scale = 1);
          },
          onTap: widget.onTap,
          borderRadius: BorderRadius.circular(20),
          child: widget.child,
        ),
      ),
    );
  }

}
