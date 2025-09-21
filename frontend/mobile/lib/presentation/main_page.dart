import 'package:area/data/provider/auth_state_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class MainPage extends ConsumerWidget {

  const MainPage({
    super.key
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('You are now logged in!'),
            ElevatedButton(
              onPressed: () {
                ref.read(authStateProvider.notifier).state = false;
              },
              child: Text('Log out')
            )
          ],
        )
      ),
    );
  }

}
