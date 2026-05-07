import 'package:flutter/material.dart';

class GadgetListPage extends StatelessWidget {
  const GadgetListPage({super.key});

  @override
  Widget build(context) => Scaffold(
    appBar: AppBar(title: const Text('Shader Gadgets')),
    body: ListView(
      children: const [
        ListTile(
          title: Text('No gadgets yet.'),
          textColor: Colors.black54,
        ),
      ],
    ),
  );
}
