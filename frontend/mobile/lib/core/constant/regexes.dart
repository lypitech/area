class Regexes {

  static final username = RegExp(r'''^[a-z0-9_.-]*$''');
  static final email = RegExp(
    r'''(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])''',
    caseSensitive: false
  );
  static final RegExp password = RegExp(r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$');
  static final RegExp eightCharactersMinimum = RegExp(r'^.{8,}$');
  static final RegExp oneCapitalizedLetter = RegExp(r'^(?=.*[A-Z]).+$');
  static final RegExp oneNonCapitalizedLetter = RegExp(r'^(?=.*[a-z]).+$');
  static final RegExp oneSpecialCharacter = RegExp(r'^(?=.*[\W_]).+$');
  static final RegExp oneNumber = RegExp(r'^(?=.*\d).+$');
  static final RegExp port = RegExp(r'^(?:0|[1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$');

}
