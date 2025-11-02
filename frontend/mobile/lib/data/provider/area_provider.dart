
import 'package:area/api/area_api.dart';
import 'package:area/data/provider/dio_provider.dart';
import 'package:area/data/repository/area_repository.dart';
import 'package:area/modal/area_modal.dart';
import 'package:area/model/area_model.dart';
import 'package:area/model/user_model.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';

final areaApiProvider = FutureProvider<AreaApi>((ref) async {
  final dio = await ref.watch(dioProvider.future);
  return AreaApi(dio: dio);
});

final areaRepositoryProvider = FutureProvider<AreaRepository>((ref) async {
  final api = await ref.watch(areaApiProvider.future);
  return AreaRepository(api: api);
});

class AreaState {

  final List<AreaModel> areas;
  final bool isLoading;
  final String? error;

  AreaState({
    required this.areas,
    required this.isLoading,
    this.error,
  });

  AreaState copyWith({
    List<AreaModel>? areas,
    bool? isLoading,
    String? error,
  }) {
    return AreaState(
      areas: areas ?? this.areas,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }

  factory AreaState.base() => AreaState(areas: [], isLoading: false);

}

class AreaNotifier extends StateNotifier<AreaState> {

  final AreaRepository repository;
  final UserModel user;

  AreaNotifier({
    required this.repository,
    required this.user
  }) : super(AreaState.base());

  @override
  AreaState get debugState => state;

  Future<void> loadAreas() async {
    state = state.copyWith(
      isLoading: true,
      error: null
    );

    try {
      final fetched = await repository.fetchAreas(user: user);

      state = state.copyWith(
        areas: fetched,
        isLoading: false
      );
    } catch (e) {
      state = state.copyWith(
        error: e.toString(),
        isLoading: false
      );
    }
  }

  Future<String?> createArea({
    required AreaModal area
  }) async {
    try {
      final createdArea = await repository.createArea(
        user: user,
        area: area
      );

      state = state.copyWith(
        areas: [
          ...state.areas,
          createdArea
        ]
      );

      return null;
    } catch (e) {
      state = state.copyWith(
        error: e.toString()
      );
      return e.toString();
    }
  }

  Future<String?> deleteArea(String uuid) async {
    try {
      await repository.deleteArea(
        user: user,
        areaUuid: uuid
      );

      state = state.copyWith(
        areas: state.areas.where((a) => a.uuid != uuid).toList(),
      );
      return null;
    } catch (e) {
      state = state.copyWith(
        error: e.toString()
      );
      return e.toString();
    }
  }

  Future<void> syncAreas() async {
    final remoteAreas = await repository.fetchAreas(user: user);
    // final syncingAreas = state.areas.where((a) => a.isSyncing);
    //
    // for (final localArea in syncingAreas) {
    //   final synced = await repository.createArea(
    //     user: user,
    //     area: localArea
    //   );
    //
    //   _replaceLocal(localArea, synced);
    // }

    state = state.copyWith(areas: remoteAreas);
  }

  void _replaceLocal(AreaModel oldArea, AreaModel newArea) {
    final index = state.areas.indexOf(oldArea);
    if (index == -1) {
      return;
    }

    final updated = [...state.areas];

    updated[index] = newArea;
    state = state.copyWith(areas: updated);
  }

}

final areaNotifierProvider =
  FutureProvider.family<AreaNotifier, UserModel>((ref, user) async {
    final repo = await ref.watch(areaRepositoryProvider.future);

    return AreaNotifier(
      repository: repo,
      user: user
    );
  });

final areaStateProvider =
  StreamProvider.family<AreaState, UserModel>((ref, user) async* {
    final notifier = await ref.watch(areaNotifierProvider(user).future);

    yield notifier.debugState; // initial state

    yield* notifier.stream; // weird magic to update ui lol
  });
