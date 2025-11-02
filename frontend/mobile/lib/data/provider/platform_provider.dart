import 'package:area/api/platform_api.dart';
import 'package:area/data/provider/dio_provider.dart';
import 'package:area/data/repository/platform_repository.dart';
import 'package:area/data/source/platform_local_data_source.dart';
import 'package:area/model/platform_model.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'hive_box_provider.dart';

final platformApiProvider = FutureProvider((ref) async => PlatformApi(await ref.watch(dioProvider.future)));

final platformLocalProvider = Provider((ref) => PlatformLocalDataSource(ref.read(hiveBoxProvider)));

final platformRepositoryProvider = FutureProvider((ref) async => PlatformRepository(
  api: await ref.watch(platformApiProvider.future),
  local: ref.read(platformLocalProvider),
));

class PlatformsNotifier extends AsyncNotifier<List<PlatformModel>> {

  late final PlatformRepository _repo;

  @override
  Future<List<PlatformModel>> build() async {
    _repo = await ref.watch(platformRepositoryProvider.future);
    return _repo.getPlatforms();
  }

  Future<void> refresh({
    bool forceRefresh = true
  }) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => _repo.getPlatforms(forceRefresh: forceRefresh));
  }

}

final platformsProvider = AsyncNotifierProvider<PlatformsNotifier, List<PlatformModel>>(PlatformsNotifier.new);
