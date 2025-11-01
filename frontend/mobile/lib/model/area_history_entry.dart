import 'package:area/core/constant/constants.dart';

class AreaHistoryEntry {

  final DateTime timestamp;
  final String status;

  AreaHistoryEntry({
    required this.timestamp,
    required this.status,
  });

  factory AreaHistoryEntry.fromJson(JsonData json) {
    return AreaHistoryEntry(
      timestamp: DateTime.tryParse(json['timestamp']) ?? DateTime.now(),
      status: json['status'] ?? 'ok'
    );
  }

}
