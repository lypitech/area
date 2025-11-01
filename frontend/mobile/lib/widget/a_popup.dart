import 'package:area/widget/dialog_button.dart';
import 'package:flutter/material.dart';
import 'package:gap/gap.dart';

class APopup extends StatelessWidget {

  final IconData? icon;
  final Color? iconColor;
  final Color? iconBackgroundColor;
  final String title;
  final String content;
  final String? subContent;
  final String confirmButtonTitle;
  final String cancelButtonTitle;
  final Color? confirmButtonColor;
  final bool showCancelButton;
  final Function? onConfirm;
  final Function? onCancel;

  const APopup({
    super.key,
    this.icon,
    this.iconColor,
    this.iconBackgroundColor,
    required this.title,
    required this.content,
    this.subContent,
    this.confirmButtonTitle = 'Confirm',
    this.cancelButtonTitle = 'Cancel',
    this.confirmButtonColor,
    this.showCancelButton = true,
    this.onConfirm,
    this.onCancel
  });

  void _closePopup(BuildContext context) {
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      titlePadding: const EdgeInsets.symmetric(vertical: 20),
      contentPadding: const EdgeInsets.symmetric(horizontal: 20),
      actionsPadding: const EdgeInsets.all(20),

      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(40))
      ),

      title: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          if (icon != null) ... {
            Container(
              padding: const EdgeInsets.all(5.0),
              decoration: BoxDecoration(
                color: iconBackgroundColor ?? Theme.of(context).primaryColor,
                borderRadius: BorderRadius.all(Radius.circular(12.5)),
                // boxShadow: <BoxShadow>[
                //   BoxShadow(
                //     color: iconBackgroundColor ?? Theme.of(context).primaryColor,
                //     blurRadius: 4,
                //     offset: Offset.zero
                //   )
                // ]
              ),
              child: Center(
                child: Icon(
                  icon!,
                  color: iconColor ?? Colors.white,
                ),
              ),
            ),

            Gap(10),
          },

          Text(
            title,
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w500
            )
          )
        ],
      ),

      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(
            content,
            style: Theme.of(context).textTheme.bodyLarge,
            textAlign: TextAlign.center,
          ),

          if (subContent != null) ... {
            Gap(20),
            Text(
              subContent!,
              style: Theme.of(context).textTheme.titleSmall?.copyWith(
                fontSize: 14
              ),
              textAlign: TextAlign.center,
            )
          }
        ]
      ),

      actions: [
        if (showCancelButton) ... {
          DialogButton(
            style: DialogButtonStyle.secondary,
            text: cancelButtonTitle,
            onTap: onCancel != null
              ? () => onCancel!()
              : () => _closePopup(context),
          )
        },
        DialogButton(
          style: DialogButtonStyle.primary,
          text: confirmButtonTitle,
          onTap: onCancel != null
            ? () => onConfirm!()
            : () => _closePopup(context),
        )
      ],
      actionsAlignment: MainAxisAlignment.center,
    );
  }
}
