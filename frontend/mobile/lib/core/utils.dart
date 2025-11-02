import 'package:intl/intl.dart';

class Utils {

  static String formatDate(DateTime dt) {
    return DateFormat('MMM dd yyyy, hh:mm a').format(dt).toString();
  }

}