import 'package:area/api/platform_api.dart';
import 'package:area/data/source/platform_local_data_source.dart';
import 'package:area/model/platform_model.dart';

class PlatformRepository {

  final PlatformApi api;
  final PlatformLocalDataSource local;

  PlatformRepository(
    this.api,
    this.local
  );

  Future<List<PlatformModel>> getPlatforms({
    bool forceRefresh = false
  }) async {
    if (!forceRefresh) {
      final cached = local.getCachedPlatforms();

      if (cached != null && cached.isNotEmpty) {
        return cached;
      }
    }

    try {
      final remote = await api.fetchPlatforms();

      await local.cachePlatforms(remote);
      return remote;
    } catch (e) {
      final cached = local.getCachedPlatforms();

      if (cached != null && cached.isNotEmpty) {
        return cached;
      }
      rethrow;
    }
  }

}
