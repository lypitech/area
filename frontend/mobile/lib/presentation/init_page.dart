import 'package:area/data/provider/auth_provider.dart';
import 'package:area/data/provider/platform_provider.dart';
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

    final authNotifier = ref.read(authNotifierProvider.notifier);
    await authNotifier.checkAuth();

    final authState = ref.read(authNotifierProvider);

    if (!mounted) {
      return;
    }

    switch (authState.status) {
      case AuthStatus.authenticated:
        context.go('/');
        break;
      case AuthStatus.unauthenticated:
        // context.go('/login');
        // break;
      case AuthStatus.unknown:
        context.go('/login');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
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
      ),
    );
  }

}
