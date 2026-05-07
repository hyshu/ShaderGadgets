import 'package:flutter/material.dart';
import 'package:swipeable_page_route/swipeable_page_route.dart';

import 'gadgets/glide/glide_gadget.dart';

class GadgetListPage extends StatelessWidget {
  const GadgetListPage({super.key});

  @override
  Widget build(context) => Scaffold(
    appBar: AppBar(title: const Text('Shader Gadgets')),
    body: ListView(
      children: const [_GadgetTile(title: 'Glide', destination: GlideGadget())],
    ),
  );
}

class _GadgetTile extends StatelessWidget {
  const _GadgetTile({required this.title, required this.destination});

  final String title;
  final Widget destination;

  @override
  Widget build(context) => ListTile(
    title: Text(title),
    trailing: const Icon(Icons.chevron_right),
    onTap: () => Navigator.of(
      context,
    ).push(SwipeablePageRoute<void>(builder: (_) => destination)),
  );
}
