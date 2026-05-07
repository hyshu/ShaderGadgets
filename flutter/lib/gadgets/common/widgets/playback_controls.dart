import 'package:flutter/material.dart';

class GadgetPlaybackControls extends StatelessWidget {
  const GadgetPlaybackControls({
    required this.playing,
    required this.onTogglePlayback,
    required this.onReset,
    super.key,
  });

  final bool playing;
  final VoidCallback onTogglePlayback;
  final VoidCallback onReset;

  @override
  Widget build(context) => Row(
    children: [
      Expanded(
        child: _GadgetPlayPauseButton(
          playing: playing,
          onPressed: onTogglePlayback,
        ),
      ),
      const SizedBox(width: 8),
      OutlinedButton.icon(
        onPressed: onReset,
        icon: const Icon(Icons.restart_alt),
        label: const Text('Reset'),
        style: OutlinedButton.styleFrom(
          minimumSize: const Size(0, 48),
          padding: const EdgeInsets.symmetric(horizontal: 16),
        ),
      ),
    ],
  );
}

class _GadgetPlayPauseButton extends StatelessWidget {
  const _GadgetPlayPauseButton({
    required this.playing,
    required this.onPressed,
  });

  final bool playing;
  final VoidCallback onPressed;

  @override
  Widget build(context) => FilledButton.icon(
    onPressed: onPressed,
    icon: Icon(playing ? Icons.pause : Icons.play_arrow),
    label: Text(playing ? 'Pause' : 'Play'),
    style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(48)),
  );
}
