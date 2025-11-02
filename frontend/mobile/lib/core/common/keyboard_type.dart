import 'package:flutter/material.dart';

class KeyboardType {

  static TextInputType fromType(String type) {
    switch (type.toLowerCase()) {
      case 'number':
      case 'int':
      case 'integer':
      case 'double':
      case 'float':
        return TextInputType.number;
      default:
        return TextInputType.text;
    }
  }

}