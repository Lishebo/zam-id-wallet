import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String baseUrl = 'http://172.20.10.14:3001FLU';
  // 10.0.2.2 is how Android emulator reaches your localhost
  // If using physical device, replace with your PC's IP address

  // Enrol a citizen and get a NIN
  static Future<Map<String, dynamic>> enrolCitizen({
    required String firstName,
    required String lastName,
    required String dateOfBirth,
    required String gender,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/enrol'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'firstName': firstName,
        'lastName': lastName,
        'dateOfBirth': dateOfBirth,
        'gender': gender,
      }),
    );

    if (response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      final error = jsonDecode(response.body);
      throw Exception(error['error'] ?? 'Enrolment failed');
    }
  }

  // Save citizen data locally on device
  static Future<void> saveToWallet(Map<String, dynamic> data) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('wallet_data', jsonEncode(data));
  }

  // Load citizen data from device
  static Future<Map<String, dynamic>?> loadFromWallet() async {
    final prefs = await SharedPreferences.getInstance();
    final data = prefs.getString('wallet_data');
    if (data == null) return null;
    return jsonDecode(data);
  }

  // Clear wallet data
  static Future<void> clearWallet() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('wallet_data');
  }
}
