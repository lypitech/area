import 'package:area/core/common/keyboard_type.dart';
import 'package:area/l10n/app_localizations.dart';
import 'package:area/layout/main_page_layout.dart';
import 'package:area/model/parameter_model.dart';
import 'package:area/widget/a_text_field.dart';
import 'package:area/widget/appbar_button.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:gap/gap.dart';
import 'package:go_router/go_router.dart';

class ParameterInputPage extends ConsumerStatefulWidget {

  final List<ParameterModel> parameters;
  final String triggerOrActionName;
  final bool isAction;
  final bool requiresPayload;

  const ParameterInputPage({
    super.key,
    required this.parameters,
    required this.triggerOrActionName,
    required this.isAction,
    required this.requiresPayload
  });

  @override
  ConsumerState<ParameterInputPage> createState() => _ParameterInputPageState();

}

class _ParameterInputPageState extends ConsumerState<ParameterInputPage> {
  late Map<String, TextEditingController> _controllers;
  late Map<String, String?> _errors;
  late TextEditingController _payloadController;

  @override
  void initState() {
    super.initState();
    _controllers = {};
    _errors = {};

    for (var param in widget.parameters) {
      _controllers[param.name] = TextEditingController();
      _errors[param.name] = null;
    }

    if (widget.requiresPayload) {
      _payloadController = TextEditingController();
      _errors['payload'] = null;
    }
  }

  @override
  void dispose() {
    for (var controller in _controllers.values) {
      controller.dispose();
    }
    if (widget.requiresPayload) {
      _payloadController.dispose();
    }
    super.dispose();
  }

  bool _validateInputs() {
    bool isValid = true;
    setState(() {
      _errors.clear();

      for (var param in widget.parameters) {
        final value = _controllers[param.name]?.text.trim() ?? '';

        if (value.isEmpty) {
          _errors[param.name] = 'This field is required';
          isValid = false;
        } else {
          switch (param.type.toLowerCase()) {
            case 'number':
            case 'int':
            case 'integer':
              if (int.tryParse(value) == null) {
                _errors[param.name] = 'Please enter a valid number';
                isValid = false;
              }
              break;
            case 'double':
            case 'float':
              if (double.tryParse(value) == null) {
                _errors[param.name] = 'Please enter a valid decimal number';
                isValid = false;
              }
              break;
          }
        }
      }

      if (widget.requiresPayload) {
        final payloadValue = _payloadController.text.trim();
        if (payloadValue.isEmpty) {
          _errors['payload'] = 'Payload is required';
          isValid = false;
        }
      }
    });

    return isValid;
  }

  Map<String, dynamic> _getParameterValues() {
    final values = <String, dynamic>{};

    for (var param in widget.parameters) {
      final value = _controllers[param.name]?.text.trim() ?? '';

      switch (param.type.toLowerCase()) {
        case 'number':
        case 'int':
        case 'integer':
          values[param.name] = int.tryParse(value) ?? value;
          break;
        case 'double':
        case 'float':
          values[param.name] = double.tryParse(value) ?? value;
          break;
        case 'bool':
        case 'boolean':
          values[param.name] = value.toLowerCase() == 'true';
          break;
        default:
          values[param.name] = value;
      }
    }

    if (widget.requiresPayload) {
      values['payload'] = _payloadController.text.trim();
    }

    return values;
  }

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    final l10n = AppLocalizations.of(context)!;

    return MainPageLayout(
      title: 'Input parameters',
      leading: AppbarButton(
        icon: Icons.arrow_back_ios_rounded,
        onTap: () => context.pop(),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          if (_validateInputs()) {
            final params = _getParameterValues();
            context.pop(params);
          }
        },
        label: Text(
          'Continue',
          style: textTheme.titleLarge?.copyWith(
            color: Colors.white,
            fontWeight: FontWeight.w600,
          ),
        ),
        icon: Icon(
          Icons.arrow_forward_rounded,
          color: Colors.white
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      children: [
        Text(
          widget.triggerOrActionName,
          style: textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        Text(
          'Please provide the required parameters below',
          style: textTheme.bodyMedium?.copyWith(
            color: Colors.grey,
          ),
        ),
        ...widget.parameters.map((param) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ATextField(
                title: param.name.replaceAll('_', ' ').toUpperCase(),
                controller: _controllers[param.name]!,
                hintText: param.description,
                keyboardType: KeyboardType.fromType(param.type),
                errorText: _errors[param.name],
                onChange: (value) {
                  if (_errors[param.name] != null) {
                    setState(() {
                      _errors[param.name] = null;
                    });
                  }
                },
              ),
              if (param.description.isNotEmpty) ...[
                Gap(4),
                Padding(
                  padding: const EdgeInsets.only(left: 4),
                  child: Text(
                    param.description,
                    style: textTheme.bodySmall?.copyWith(
                      color: Colors.grey.shade600,
                    ),
                  ),
                ),
              ],
            ],
          );
        }),
        if (widget.requiresPayload) ...[
          if (widget.parameters.isNotEmpty) ...[
            Divider(
              color: Colors.grey.shade300,
            ),
          ],

          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(
                    Icons.data_object,
                    size: 20,
                    color: Theme.of(context).primaryColor,
                  ),
                  const Gap(8),
                  Text(
                    'Payload',
                    style: textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              Gap(5),
              Text(
                'The data that will be sent with this action',
                style: textTheme.bodySmall?.copyWith(
                  color: Colors.grey.shade600,
                ),
              ),
              Gap(10),
              ATextField(
                title: '',
                controller: _payloadController,
                hintText: 'Enter payload data...',
                errorText: _errors['payload'],
                onChange: (value) {
                  if (_errors['payload'] != null) {
                    setState(() {
                      _errors['payload'] = null;
                    });
                  }
                },
              ),
            ],
          ),
        ]
      ],
    );
  }
}
