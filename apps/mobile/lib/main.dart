import 'package:flutter/material.dart';
import 'screens/splash_screen.dart';

void main() {
  runApp(const ZamIDWalletApp());
}

class ZamIDWalletApp extends StatelessWidget {
  const ZamIDWalletApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ZAM-ID Wallet',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1B5E20),
          primary: const Color(0xFF1B5E20),
        ),
        useMaterial3: true,
        fontFamily: 'Roboto',
      ),
      home: const SplashScreen(),
    );
  }
}
