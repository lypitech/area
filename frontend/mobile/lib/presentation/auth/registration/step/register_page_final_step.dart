import 'package:area/l10n/app_localizations.dart';
import 'package:area/widget/logo.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class RegisterPageFinalStep extends ConsumerStatefulWidget {

  const RegisterPageFinalStep({
    super.key
  });

  @override
  ConsumerState<RegisterPageFinalStep> createState() => _RegisterPageFinalStepState();

}

class _RegisterPageFinalStepState extends ConsumerState<RegisterPageFinalStep> {

  @override
  void initState() {
    Future.delayed(
      const Duration(seconds: 3),
      () {
        // ...
      }
    );
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final textTheme = Theme.of(context).textTheme;

    return PopScope(
      canPop: false,
      child: Scaffold(
        body: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                spacing: 20,
                children: [
                  Logo(
                    size: 96,
                  ),
                  Text(
                    l10n.register_page_final_title,
                    style: textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.w500,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  CircularProgressIndicator(
                    backgroundColor: Colors.grey.shade300,
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
