import 'package:area/layout/main_page_layout.dart';
import 'package:area/widget/clickable_frame.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class MyAreasPage extends StatelessWidget {

  const MyAreasPage({
    super.key
  });

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return MainPageLayout(
      title: 'My AREAs',
      children: [

      ],
    );
  }

}
