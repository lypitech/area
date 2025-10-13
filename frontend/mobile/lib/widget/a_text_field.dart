import 'package:flutter/material.dart';

class ATextField extends StatefulWidget {

  final String title;
  final String? hintText;
  final IconData? leadingIcon;
  final bool obscureToggle;
  final TextInputType keyboardType;
  final int? maxLength;
  final TextEditingController? controller;
  final String? Function(String?)? validator;
  final bool showValidator;
  final void Function(String?)? onChange;

  const ATextField({
    required this.title,
    this.hintText,
    this.leadingIcon,
    this.obscureToggle = false,
    this.keyboardType = TextInputType.text,
    this.maxLength,
    this.controller,
    this.validator,
    this.showValidator = true,
    this.onChange,
    super.key
  });

  @override
  State<ATextField> createState() => _ATextFieldState();

}

class _ATextFieldState extends State<ATextField> {

  bool _obscureText = false;

  void _toggleObscureText() {
    setState(() {
      _obscureText = !_obscureText;
    });
  }

  @override
  void initState() {
    if (widget.obscureToggle) {
      _obscureText = true;
    }
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: widget.controller,
      keyboardType: widget.keyboardType,
      obscureText: _obscureText,
      validator: widget.validator,
      maxLength: widget.maxLength,
      buildCounter: (
        _, {
          required int currentLength,
          required bool isFocused,
          required int? maxLength,
        }) {
        return null;
      },
      onChanged: widget.onChange,
      decoration: InputDecoration(
        labelText: widget.title,
        hintText: widget.hintText,
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.all(20),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(20),
          borderSide: BorderSide.none
        ),
        prefixIcon: widget.leadingIcon != null
          ? Icon(widget.leadingIcon)
          : null,
        suffixIcon: widget.obscureToggle
          ? IconButton(
            onPressed: _toggleObscureText,
            icon: Icon(
              _obscureText
                ? Icons.visibility
                : Icons.visibility_off,
            ),
          )
          : null
      ),
    );
  }

}
