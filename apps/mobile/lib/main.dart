import 'package:flutter/material.dart';

void main() => runApp(const NoMouseApp());

class NoMouseApp extends StatelessWidget {
  const NoMouseApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'No Mouse',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
      ),
      darkTheme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.blue,
          brightness: Brightness.dark,
        ),
      ),
      home: Scaffold(
        appBar: AppBar(title: const Text('No Mouse')),
        body: SafeArea(
          child: ListView(
            padding: const EdgeInsets.all(24),
            children: const [
              Text('Komputer Saya', style: TextStyle(fontSize: 24)),
              SizedBox(height: 24),
              Text('Belum ada komputer terhubung.'),
              SizedBox(height: 8),
              Text('Pairing belum tersedia pada versi fondasi.'),
            ],
          ),
        ),
      ),
    );
  }
}
