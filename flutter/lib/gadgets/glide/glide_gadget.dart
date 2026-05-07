import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter_shaders/flutter_shaders.dart';

import '../common/models/gadget_info.dart';
import '../common/widgets/widgets.dart';

const _panelExtent = 280.0;
const _effectPadding = 30.0;
const _effectExtent = _panelExtent + _effectPadding * 2;
const _panelSize = Size.square(_panelExtent);
const _effectSize = Size.square(_effectExtent);
const _playDuration = Duration(seconds: 2);
const _glideShader = 'shaders/glide.frag';
const _glideInfo = GadgetInfo(
  sources: [
    GadgetInfoLink(
      label: 'Original shader',
      url: 'https://x.com/du_yuan161/status/2047713364810555890',
    ),
    GadgetInfoLink(
      label: 'hash21 / Hash without Sine',
      url: 'https://www.shadertoy.com/view/4djSRW',
    ),
  ],
  availableIn: ['SwiftUI', 'React Native', 'Web', 'Flutter'],
);

const _glideSourceSpec = _GradientTextSpec(
  text: 'Use it',
  fontSize: 72,
  alignment: Alignment.topCenter,
  colors: [
    Color(0xFF9C27B0),
    Color(0xFFE91E63),
    Color(0xFFFF9800),
    Color(0xFFFFEB3B),
  ],
);

const _glideTargetSpec = _GradientTextSpec(
  text: 'Or lose it',
  fontSize: 52,
  alignment: Alignment.bottomCenter,
  colors: [
    Color(0xFF2196F3),
    Color(0xFF009688),
    Color(0xFF4CAF50),
    Color(0xFF80CBC4),
  ],
);

class GlideGadget extends StatefulWidget {
  const GlideGadget({super.key});

  @override
  State<GlideGadget> createState() => _GlideGadgetState();
}

class _GlideGadgetState extends State<GlideGadget>
    with SingleTickerProviderStateMixin {
  late final AnimationController _playController;
  ui.Image? _targetImage;
  double? _targetDevicePixelRatio;
  double _time = 0;

  @override
  void initState() {
    super.initState();
    _playController = AnimationController(vsync: this, duration: _playDuration)
      ..addListener(() {
        setState(() => _time = _playController.value);
      })
      ..addStatusListener((_) {
        if (mounted) setState(() {});
      });
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _ensureTargetImage();
  }

  @override
  void dispose() {
    _playController.dispose();
    _targetImage?.dispose();
    super.dispose();
  }

  @override
  Widget build(context) => Scaffold(
    appBar: AppBar(
      title: const Text('Glide'),
      actions: const [GadgetInfoButton(info: _glideInfo)],
    ),
    body: Column(
      children: [
        Expanded(
          child: Center(
            child: _EffectSlot(
              child: _time >= 1
                  ? const _GradientTextPanel(spec: _glideTargetSpec)
                  : GlideEffect(
                      time: _time,
                      baseAngle: math.pi / 2,
                      targetImage: _targetImage,
                      child: const _GradientTextPanel(spec: _glideSourceSpec),
                    ),
            ),
          ),
        ),
        GadgetControlPane(
          children: [
            GadgetLabeledSlider(
              label: 'time',
              valueText: _time.toStringAsFixed(3),
              value: _time,
              onChanged: _setTime,
            ),
            GadgetPlaybackControls(
              playing: _playController.isAnimating,
              onTogglePlayback: _togglePlayback,
              onReset: _reset,
            ),
          ],
        ),
      ],
    ),
  );

  void _ensureTargetImage() {
    final devicePixelRatio = MediaQuery.devicePixelRatioOf(context);
    if (_targetImage != null && _targetDevicePixelRatio == devicePixelRatio) {
      return;
    }

    final previous = _targetImage;
    _targetImage = _renderEffectViewportImage(
      _glideTargetSpec,
      devicePixelRatio: devicePixelRatio,
    );
    _targetDevicePixelRatio = devicePixelRatio;
    previous?.dispose();
  }

  void _setTime(double value) {
    _playController.stop();
    _playController.value = value;
    setState(() => _time = value);
  }

  void _togglePlayback() {
    if (_playController.isAnimating) {
      _playController.stop();
      setState(() {});
      return;
    }

    final startTime = _time >= 1 ? 0.0 : _time;
    _playController.forward(from: startTime);
  }

  void _reset() {
    _playController.stop();
    _playController.value = 0;
    setState(() => _time = 0);
  }
}

class GlideEffect extends StatelessWidget {
  const GlideEffect({
    required this.time,
    required this.baseAngle,
    required this.targetImage,
    required this.child,
    super.key,
  });

  final double time;
  final double baseAngle;
  final ui.Image? targetImage;
  final Widget child;

  @override
  Widget build(context) {
    final imageB = targetImage;
    if (time <= 0 || imageB == null) return _PanelFrame(child: child);

    return ShaderBuilder(
      assetKey: _glideShader,
      child: _EffectViewport(child: child),
      (context, shader, child) => AnimatedSampler((imageA, size, canvas) {
        shader
          ..setFloat(0, size.width)
          ..setFloat(1, size.height)
          ..setFloat(2, _effectPadding)
          ..setFloat(3, _effectPadding)
          ..setFloat(4, _panelSize.width)
          ..setFloat(5, _panelSize.height)
          ..setFloat(6, time.clamp(0, 1))
          ..setFloat(7, baseAngle)
          ..setImageSampler(0, imageA)
          ..setImageSampler(1, imageB);

        canvas.drawRect(Offset.zero & size, Paint()..shader = shader);
      }, child: child!),
    );
  }
}

class _EffectSlot extends StatelessWidget {
  const _EffectSlot({required this.child});

  final Widget child;

  @override
  Widget build(context) => SizedBox.fromSize(
    size: _panelSize,
    child: OverflowBox(
      maxWidth: _effectSize.width,
      maxHeight: _effectSize.height,
      child: child,
    ),
  );
}

class _EffectViewport extends StatelessWidget {
  const _EffectViewport({required this.child});

  final Widget child;

  @override
  Widget build(context) => SizedBox.fromSize(
    size: _effectSize,
    child: Stack(
      children: [
        Positioned(
          left: _effectPadding,
          top: _effectPadding,
          width: _panelSize.width,
          height: _panelSize.height,
          child: child,
        ),
      ],
    ),
  );
}

class _PanelFrame extends StatelessWidget {
  const _PanelFrame({required this.child});

  final Widget child;

  @override
  Widget build(context) => SizedBox.fromSize(size: _panelSize, child: child);
}

class _GradientTextPanel extends StatelessWidget {
  const _GradientTextPanel({required this.spec});

  final _GradientTextSpec spec;

  @override
  Widget build(context) =>
      CustomPaint(painter: _GradientTextPanelPainter(spec), size: _panelSize);
}

class _GradientTextPanelPainter extends CustomPainter {
  const _GradientTextPanelPainter(this.spec);

  final _GradientTextSpec spec;

  @override
  void paint(Canvas canvas, Size size) => spec.paint(canvas, size);

  @override
  bool shouldRepaint(covariant _GradientTextPanelPainter oldDelegate) =>
      oldDelegate.spec != spec;
}

@immutable
class _GradientTextSpec {
  const _GradientTextSpec({
    required this.text,
    required this.fontSize,
    required this.alignment,
    required this.colors,
  });

  final String text;
  final double fontSize;
  final Alignment alignment;
  final List<Color> colors;

  void paint(Canvas canvas, Size size) {
    final bounds = Offset.zero & size;
    final textPainter = TextPainter(
      text: TextSpan(
        text: text,
        style: TextStyle(
          fontSize: fontSize,
          fontWeight: FontWeight.w900,
          foreground: Paint()
            ..shader = ui.Gradient.linear(
              bounds.centerLeft,
              bounds.centerRight,
              colors,
              _evenStops(colors.length),
            ),
        ),
      ),
      textAlign: TextAlign.center,
      textDirection: TextDirection.ltr,
    )..layout(maxWidth: size.width);

    final offset = Offset(
      (size.width - textPainter.width) / 2,
      (size.height - textPainter.height) * ((alignment.y + 1) / 2),
    );
    textPainter.paint(canvas, offset);
  }
}

List<double> _evenStops(int count) {
  if (count <= 1) return const [0];
  return List<double>.generate(count, (index) => index / (count - 1));
}

ui.Image _renderEffectViewportImage(
  _GradientTextSpec spec, {
  required double devicePixelRatio,
}) {
  final pixelWidth = (_effectSize.width * devicePixelRatio).ceil();
  final pixelHeight = (_effectSize.height * devicePixelRatio).ceil();
  final recorder = ui.PictureRecorder();
  final canvas = Canvas(recorder)..scale(devicePixelRatio, devicePixelRatio);

  canvas.translate(_effectPadding, _effectPadding);
  spec.paint(canvas, _panelSize);

  final picture = recorder.endRecording();
  final image = picture.toImageSync(pixelWidth, pixelHeight);
  picture.dispose();
  return image;
}
