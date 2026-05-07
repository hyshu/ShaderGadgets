import 'package:flutter/material.dart';

import 'gadget_list.dart';

void main() => runApp(const ShaderGadgetsApp());

class ShaderGadgetsApp extends StatelessWidget {
  const ShaderGadgetsApp({super.key});

  @override
  Widget build(context) => MaterialApp(
    debugShowCheckedModeBanner: false,
    title: 'Shader Gadgets',
    home: const GadgetListPage(),
  );
}
