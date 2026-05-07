import 'dart:ui' as ui;

import 'package:flutter/material.dart';

class GadgetLabeledSlider extends StatelessWidget {
  const GadgetLabeledSlider({
    required this.label,
    required this.valueText,
    required this.value,
    required this.onChanged,
    super.key,
  });

  final String label;
  final String valueText;
  final double value;
  final ValueChanged<double> onChanged;

  @override
  Widget build(context) {
    const textStyle = TextStyle(
      fontFeatures: [ui.FontFeature.tabularFigures()],
    );

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          children: [
            Text(label, style: textStyle),
            const Spacer(),
            Text(valueText, style: textStyle),
          ],
        ),
        Slider(value: value, onChanged: onChanged),
      ],
    );
  }
}
