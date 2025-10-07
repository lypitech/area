import 'package:flutter/material.dart';

class FieldValidator extends StatelessWidget {

  final String title;
  final RegExp rule;
  final String strToTest;

  const FieldValidator({
    required this.title,
    required this.rule,
    required this.strToTest,
    super.key
  });

  @override
  Widget build(BuildContext context) {
    final isRuleRespected = rule.hasMatch(strToTest);

    return AnimatedSize(
      duration: const Duration(milliseconds: 100),
      curve: Curves.easeInOut,
      child: AnimatedContainer(
        decoration: BoxDecoration(
          color:
            isRuleRespected
              ? Colors.lightGreen.withOpacity(0.4)
              : Colors.grey.withOpacity(0.4),
          borderRadius: BorderRadius.circular(8)
        ),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        duration: const Duration(milliseconds: 100),
        curve: Curves.easeInOut,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          spacing: 5,
          children: <Widget>[
            if (isRuleRespected) ... {
              const Icon(
                Icons.check_rounded,
                color: Colors.lightGreen,
                size: 20,
              ),
            },
            Text(
              title,
              // style: const TextStyle(
              //   color: Colors.white
              // ),
            )
          ],
        ),
      ),
    );
  }

}
