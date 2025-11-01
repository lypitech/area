import 'package:area/widget/a_popup.dart';
import 'package:flutter/material.dart';

class ErrorDialog extends StatelessWidget {

  final VoidCallback? onConfirm;
  final String error;

  const ErrorDialog({
    super.key,
    required this.error,
    this.onConfirm
  });

  static void show({
    required BuildContext context,
    required String error,
    VoidCallback? onConfirm
  }) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return ErrorDialog(
          error: error
        );
      }
    );
  }

  @override
  Widget build(BuildContext context) {
    return APopup(
      icon: Icons.close_rounded,
      iconBackgroundColor: Colors.red,
      title: 'Error',
      content: error,
      confirmButtonTitle: 'OK',
      showCancelButton: false,
      confirmButtonColor: Colors.red,
      onConfirm: onConfirm,
    );
  }

}
