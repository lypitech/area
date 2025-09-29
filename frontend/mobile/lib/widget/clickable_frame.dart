import 'package:flutter/material.dart';

class ClickableFrame extends StatefulWidget {

  final VoidCallback? onTap;
  final double borderRadius;
  final EdgeInsets padding;
  final Widget child;

  const ClickableFrame({
    this.onTap,
    this.borderRadius = 20,
    this.padding = EdgeInsets.zero,
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
        borderRadius: BorderRadius.circular(widget.borderRadius),
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
          borderRadius: BorderRadius.circular(widget.borderRadius),
          child: Padding(
            padding: widget.padding,
            child: widget.child,
          ),
        ),
      ),
    );
  }

}
