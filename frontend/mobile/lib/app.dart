import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:area/l10n/app_localizations.dart';
import 'package:area/core/constant/constants.dart';
import 'package:area/core/router.dart';

class App extends ConsumerWidget {

  const App({
    super.key
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);

    return MaterialApp.router(
      routerConfig: router,
      title: Constants.appName,
      debugShowCheckedModeBanner: true,
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
    );
  }

}
