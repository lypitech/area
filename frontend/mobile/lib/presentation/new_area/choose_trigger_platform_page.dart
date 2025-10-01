import 'package:area/layout/main_page_layout.dart';
import 'package:area/widget/appbar_button.dart';
import 'package:area/widget/clickable_frame.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:gap/gap.dart';
import 'package:go_router/go_router.dart';

class ChooseTriggerPlatformPage extends ConsumerStatefulWidget {

  const ChooseTriggerPlatformPage({
    super.key
  });

  @override
  ConsumerState<ChooseTriggerPlatformPage> createState() => _ChooseTriggerPlatformPageState();

}

class _ChooseTriggerPlatformPageState extends ConsumerState<ChooseTriggerPlatformPage> {

  final _searchBarController = TextEditingController();

  final List<String> _platforms = ["Spotify", "Instagram", "X (formerly Twitter)", "TikTok", "Google", "GitHub", "Snapchat", "Discord"];

  @override
  void dispose() {
    _searchBarController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MainPageLayout(
      title: 'Choose a platform',
      leading: AppbarButton(
        icon: Icons.arrow_back_ios_rounded,
        onTap: () {
          context.pop();
        }
      ),
      children: [
        CupertinoSearchTextField(
          autocorrect: false,
          controller: _searchBarController,
          style: Theme.of(context).textTheme.bodyLarge,
        ),
        Wrap(
          spacing: 20,
          runSpacing: 20,
          children: _platforms
            .map((name) {
              final width = (MediaQuery.of(context).size.width / 2) - 20 - 10;
              return SizedBox(
                width: width,
                child: PlatformCard(name: name),
              );
            })
            .toList(),
        )
      ]
    );
  }

}

class PlatformCard extends StatelessWidget {

  final String name;

  const PlatformCard({
    required this.name,
    super.key
  });

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return ClickableFrame(
      padding: const EdgeInsets.all(20),
      child: Stack(
        children: [
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                height: 48,
                width: 48,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                ),
                child: Placeholder(), // TODO: Put platform icon
              ),
              Gap(5),
              Text(
                name,
                style: textTheme.titleMedium?.copyWith(
                  fontSize: 20
                ),
              ),
              // Spacer(),
              Text(
                '-- available',
                style: textTheme.bodyMedium,
              )
            ],
          ),
          Positioned(
            top: 0,
            right: 0,
            child: Icon(
              Icons.person_off_rounded,
              color: Colors.red,
              size: 20,
            )
          )
        ],
      )
    );
  }

}

