import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:no_mouse/main.dart';

void main() {
  testWidgets('starts without pretending a computer is connected', (
    tester,
  ) async {
    await tester.pumpWidget(const NoMouseApp());

    expect(find.text('No Mouse'), findsOneWidget);
    expect(find.text('Komputer Saya'), findsOneWidget);
    expect(find.text('Belum ada komputer terhubung.'), findsOneWidget);
    expect(
      find.text('Pairing belum tersedia pada versi fondasi.'),
      findsOneWidget,
    );
    expect(find.byType(FloatingActionButton), findsNothing);
  });

  testWidgets('empty state stays readable on a narrow screen with large text', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(320, 640);
    tester.view.devicePixelRatio = 1;
    tester.platformDispatcher.textScaleFactorTestValue = 2;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);

    await tester.pumpWidget(const NoMouseApp());
    expect(
      find.text('Pairing belum tersedia pada versi fondasi.'),
      findsOneWidget,
    );
    await tester.ensureVisible(
      find.text('Pairing belum tersedia pada versi fondasi.'),
    );

    expect(tester.takeException(), isNull);
    expect(find.text('Belum ada komputer terhubung.'), findsOneWidget);
  });
}
