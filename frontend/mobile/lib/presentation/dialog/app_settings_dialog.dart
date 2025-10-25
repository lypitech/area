import 'package:area/core/constant/regexes.dart';
import 'package:area/data/provider/app_settings_provider.dart';
import 'package:area/data/provider/dio_provider.dart';
import 'package:area/l10n/app_localizations.dart';
import 'package:area/layout/bottom_sheet_layout.dart';
import 'package:area/widget/a_text_field.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gap/gap.dart';

class AppSettingsDialog {

  static void show(BuildContext context, WidgetRef ref) async {
    final l10n = AppLocalizations.of(context)!;

    final appSettings = await ref.watch(appSettingsProvider.future);

    final formKey = GlobalKey<FormState>();
    final apiUrlController = TextEditingController();
    final apiPortController = TextEditingController();

    apiUrlController.text = appSettings.apiUrl;
    apiPortController.text = appSettings.apiPort;

    if (!context.mounted) {
      return;
    }

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setModalState) {
            return Padding(
              padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
              child: Form(
                key: formKey,
                child: ModalBottomSheetLayout(
                  icon: Icons.settings,
                  title: 'App settings',
                  onConfirm: () {
                    if (!formKey.currentState!.validate()) {
                      return false;
                    }

                    appSettings.saveSettings(
                      apiUrl: apiUrlController.text,
                      apiPort: apiPortController.text
                    );

                    return true;
                  },
                  children: [
                    ATextField(
                      title: 'API URL',
                      leadingIcon: Icons.web,
                      controller: apiUrlController,
                      validator: (String? value) {
                        if (value == null || value.isEmpty) {
                          return l10n.validator_empty_password;
                        }
                        return null;
                      },
                    ),
                    Gap(20),
                    ATextField(
                      title: 'API Port',
                      leadingIcon: Icons.web,
                      controller: apiPortController,
                      keyboardType: TextInputType.number,
                      validator: (String? value) {
                        if (value == null || value.isEmpty) {
                          return l10n.validator_empty_password;
                        }
                        if (!Regexes.port.hasMatch(value)) {
                          return 'erm, overflow.';
                        }
                        return null;
                      },
                    )
                  ]
                ),
              ),
            );
          },
        );
      }
    );
  }

}
