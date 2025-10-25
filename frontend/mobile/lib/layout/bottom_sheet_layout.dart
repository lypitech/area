import 'package:area/widget/dialog_button.dart';
import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:go_router/go_router.dart';

class ModalBottomSheetLayout extends StatelessWidget {

  final IconData icon;
  final Color iconBackgroundColor;
  final String title;
  final String? description;
  final bool showActions;
  final Future<bool> Function()? onConfirm;
  final List<Widget> children;

  const ModalBottomSheetLayout({
    super.key,

    required this.icon,
    this.iconBackgroundColor = Colors.grey,
    required this.title,
    this.description,
    this.showActions = true,
    this.onConfirm,
    required this.children
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      children: <Widget>[
        Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: <Widget>[
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                spacing: 12.5,
                children: <Widget>[
                  Container(
                    decoration: BoxDecoration(
                      color: iconBackgroundColor,
                      borderRadius: BorderRadius.circular(15),
                      boxShadow: <BoxShadow>[
                        BoxShadow(
                          blurRadius: 4,
                          color: iconBackgroundColor,
                        )
                      ]
                    ),
                    padding: const EdgeInsets.all(5),
                    child: Icon(
                      icon,
                      color: Colors.white,
                      size: 26,
                    ),
                  ),
                  Text(
                    title,
                    style: Theme.of(context).textTheme.titleMedium
                    // ?.copyWith(
                    //   color: Colors.white
                    // ),
                  ),
                ],
              ),

              if (description != null) ... {
                Gap(10),
                Text(
                  description!,
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.normal
                  )
                )
              },

              Gap(20),
              Column(
                children: children
              ),
              Gap(20),

              if (showActions) ... {
                Row(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  spacing: 20,
                  children: <Widget>[
                    DialogButton(
                      style: DialogButtonStyle.secondary,
                      text: 'Cancel',
                      onTap: () => context.pop()
                    ),
                    DialogButton(
                      style: DialogButtonStyle.primary,
                      text: 'Confirm',
                      onTap: () async {
                        if (onConfirm != null) {
                          final dynamic result = onConfirm!();

                          if (result is bool && result == false) {
                            return;
                          }
                        }

                        if (context.mounted) {
                          context.pop();
                        }
                      }
                    ),
                  ],
                )
              }
            ],
          ),
        )
      ],
    );
  }

}
