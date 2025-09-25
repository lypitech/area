import 'package:area/data/provider/register_modal_provider.dart';
import 'package:area/widget/a_appbar.dart';
import 'package:area/widget/appbar_button.dart';
import 'package:area/widget/clickable_frame.dart';
import 'package:area/widget/dot_stepper.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class RegisterPageLayout extends ConsumerWidget {

  final String title;
  final List<Widget> children;
  final VoidCallback onConfirm;

  const RegisterPageLayout({
    required this.title,
    required this.children,
    required this.onConfirm,
    super.key
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final registerModal = ref.read(registerModalProvider);
    final textTheme = Theme.of(context).textTheme;

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) {
          return;
        }

        if (registerModal.currentPage == 0) {
          return context.go('/login');
        }
        registerModal.currentPage--;
      },
      child: Scaffold(
        appBar: AAppbar(
          leading: AppbarButton(
            icon: Icons.arrow_back_ios_rounded,
            onTap: () {
              if (registerModal.currentPage == 0) {
                return context.go('/login');
              }
              registerModal.currentPage--;
              context.pop();
            }
          ),
        ),
        body: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                spacing: 40,
                children: [
                  Text(
                    title,
                    style: textTheme.displaySmall?.copyWith(
                      fontWeight: FontWeight.w500
                    ),
                  ),
                  Column(
                    children: children,
                  ),
                  Column(
                    mainAxisSize: MainAxisSize.min,
                    spacing: 20,
                    children: [
                      ClickableFrame(
                        child: Padding(
                          padding: const EdgeInsetsGeometry.all(20),
                          child: Icon(Icons.arrow_forward_ios_rounded),
                        )
                      ),
                      DotStepper(
                        amount: registerModal.totalPages,
                        index: registerModal.currentPage + 1
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

}
