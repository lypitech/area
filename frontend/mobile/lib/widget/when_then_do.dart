import 'package:area/l10n/app_localizations.dart';
import 'package:flutter/material.dart';

class WhenThenDo extends StatelessWidget {

  const WhenThenDo({
    super.key
  });

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final textTheme = Theme.of(context).textTheme;

    return Column(
      spacing: 5,
      children: [
        Text(
          l10n.new_area_when,
          style: textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.w500
          ),
        ),
        RotatedBox(
          quarterTurns: 1,
          child: Icon(
            Icons.link,
            size: 32,
          ),
        ),
        Text(
          l10n.new_area_then,
          style: textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.w500
          ),
        )
      ],
    );
  }

}
