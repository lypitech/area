import 'package:area/core/utils.dart';
import 'package:area/model/area_history_entry.dart';
import 'package:area/widget/clickable_frame.dart';
import 'package:flutter/material.dart';

class LogCard extends StatelessWidget {

  final int counter;
  final AreaHistoryEntry log;

  const LogCard({
    required this.counter,
    required this.log,
    super.key
  });

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    final isSuccess = log.status == 'ok';

    return ClickableFrame(
      padding: const EdgeInsets.all(20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            spacing: 2.5,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '#$counter',
                style: textTheme.bodySmall?.copyWith(
                  color: Colors.grey,
                  fontStyle: FontStyle.italic
                ),
              ),
              Text(
                Utils.formatDate(log.timestamp),
                style: textTheme.titleMedium,
              ),
            ],
          ),
          Icon(
            isSuccess ? Icons.check_rounded : Icons.close_rounded,
            size: 36,
            color: isSuccess ? Colors.green : Colors.red,
          )
        ],
      )
    );
  }

}
