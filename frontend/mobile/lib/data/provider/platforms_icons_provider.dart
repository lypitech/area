import 'dart:convert';

import 'package:area/data/provider/platform_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final platformsImageProvider = Provider<Map<String, Image>>((ref) {
  final asyncPlatforms = ref.watch(platformsProvider);

  return asyncPlatforms.when(
    data: (platforms) {
      final map = <String, Image>{};
      for (final p in platforms) {
        if (p.iconBase64 != null && p.iconBase64!.isNotEmpty) {
          map[p.name.toLowerCase()] = Image.memory(base64Decode(p.iconBase64!));
        }
      }
      return map;
    },
    loading: () => {},
    error: (_, __) => {},
  );
});

