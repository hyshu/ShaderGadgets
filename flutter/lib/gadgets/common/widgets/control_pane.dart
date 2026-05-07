import 'package:flutter/material.dart';

class GadgetControlPane extends StatelessWidget {
  const GadgetControlPane({required this.children, super.key});

  final List<Widget> children;

  @override
  Widget build(context) => Padding(
    padding: const EdgeInsets.fromLTRB(24, 0, 24, 32),
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        for (final child in children) ...[
          child,
          if (child != children.last) const SizedBox(height: 12),
        ],
      ],
    ),
  );
}
