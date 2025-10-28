import 'package:area/data/provider/auth_provider.dart';
import 'package:area/data/provider/platform_provider.dart';
import 'package:area/presentation/dialog/app_settings_dialog.dart';
import 'package:area/widget/clickable_frame.dart';
import 'package:area/widget/logo.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class InitPage extends ConsumerStatefulWidget {

  const InitPage({
    super.key
  });

  @override
  ConsumerState<InitPage> createState() => _InitPageState();

}

class _InitPageState extends ConsumerState<InitPage> {

  bool _initialized = false;

  @override
  void initState() {
    _init();
    super.initState();
  }

  Future<void> _init() async {
    if (_initialized) {
      return;
    }

    _initialized = true;

    ref.read(platformsProvider.notifier).refresh(forceRefresh: true);

    final authNotifier = await ref.read(authNotifierProvider.future);
    await authNotifier.checkAuth();

    final authNotifierAsync = ref.watch(authNotifierProvider);

    authNotifierAsync.when(
      data: (authNotifier) async {
        await authNotifier.checkAuth();

        if (!mounted) {
          return;
        }

        final authState = authNotifier.state;

        switch (authState.status) {
          case AuthStatus.authenticated:
            context.go('/');
            break;
          case AuthStatus.unauthenticated:
          case AuthStatus.unknown:
            context.go('/login');
            break;
        }
      },
      loading: () {},
      error: (err, stack) {
        print('Failed to initialize AuthNotifier: $err');
        if (mounted) {
          context.go('/login');
        }
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Positioned(
            top: 40,
            left: 20,
            child: ClickableFrame(
              padding: const EdgeInsets.all(10),
              onTap: () => AppSettingsDialog.show(context, ref),
              child: Icon(Icons.settings)
            )
          ),
          Positioned.fill(
            child: Center(
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  spacing: 20,
                  children: [
                    Logo(),
                    CircularProgressIndicator()
                  ],
                ),
              ),
            )
          )
        ],
      ),
    );
  }

}
