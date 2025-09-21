import 'package:flutter/material.dart';

class Theme {

  static ThemeData light() {
    final base = ThemeData.light();

    final textTheme = base.textTheme.apply(
      fontFamily: 'Kanit',
      displayColor: Color(0XFF28282B)
    );

    return base.copyWith(
      scaffoldBackgroundColor: Color(0XFFF8F7F3),
      colorScheme: ColorScheme.light(
        primary: Color(0XFF28282B)
      ),
      textTheme: textTheme,
      appBarTheme: AppBarTheme(
        elevation: 0,
        centerTitle: true,
      ),
      inputDecorationTheme: InputDecorationTheme(
        labelStyle: textTheme.bodyMedium?.copyWith(
          color: textTheme.bodyMedium!.color!.withOpacity(.3)
        ),
        hintStyle: textTheme.bodyLarge?.copyWith(
          color: textTheme.bodyLarge!.color!.withOpacity(.3)
        ),
      )
    );
  }

  static ThemeData dark() {
    final base = ThemeData.dark();

    return base.copyWith(
      // scaffoldBackgroundColor: Color(0XFF28282B),
      textTheme: base.textTheme.apply(
        fontFamily: 'Kanit',
        displayColor: Color(0XFFF8F7F3)
      ),
      appBarTheme: AppBarTheme(
        elevation: 0,
        centerTitle: true,
      ),
    );
  }

}
