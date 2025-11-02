import 'package:area/core/constant/constants.dart';
import 'package:area/model/platform_model.dart';
import 'package:hive_flutter/hive_flutter.dart';

class PlatformLocalDataSource {

  final Box _box;
  static const String _key = 'platforms';

  PlatformLocalDataSource(
    this._box
  );

  Future<void> cachePlatforms(List<PlatformModel> platforms) async {
    final list = platforms.map((platform) => platform.toJson()).toList();

    await _box.put(_key, list);
    await _box.put('${_key}_lastUpdated', DateTime.now().toIso8601String());
  }

  List<PlatformModel>? getCachedPlatforms() {
    final raw = _box.get(_key) as List<dynamic>?;

    if (raw == null) {
      return null;
    }

    return raw
      .map((e) => PlatformModel.fromJson(JsonData.from(e)))
      .toList();
  }

  DateTime? lastUpdated() {
    final s = _box.get('${_key}_lastUpdated') as String?;

    return s == null
      ? null
      : DateTime.tryParse(s);
  }

}
