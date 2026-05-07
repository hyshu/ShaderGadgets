import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../models/gadget_info.dart';

class GadgetInfoButton extends StatelessWidget {
  const GadgetInfoButton({required this.info, super.key});

  final GadgetInfo info;

  @override
  Widget build(context) => IconButton(
    tooltip: 'Gadget information',
    icon: const Icon(Icons.info_outline),
    onPressed: () => _showInfoSheet(context),
  );

  void _showInfoSheet(BuildContext context) {
    showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      builder: (context) => SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Info', style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 20),
              _SectionTitle('Sources'),
              const SizedBox(height: 8),
              for (final source in info.sources) ...[
                _SourceLink(source: source),
                if (source != info.sources.last) const SizedBox(height: 8),
              ],
              const SizedBox(height: 20),
              const _SectionTitle('Available'),
              const SizedBox(height: 8),
              Text(
                info.availableIn.join(', '),
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  const _SectionTitle(this.text);

  final String text;

  @override
  Widget build(context) => Text(
    text,
    style: Theme.of(context).textTheme.labelLarge?.copyWith(
      color: Theme.of(context).colorScheme.onSurfaceVariant,
    ),
  );
}

class _SourceLink extends StatelessWidget {
  const _SourceLink({required this.source});

  final GadgetInfoLink source;

  @override
  Widget build(context) => InkWell(
    borderRadius: BorderRadius.circular(8),
    onTap: () => _openUrl(context, source.url),
    child: Container(
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        border: Border.all(color: Theme.of(context).colorScheme.outlineVariant),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            source.label,
            style: Theme.of(
              context,
            ).textTheme.labelLarge?.copyWith(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 3),
          Text(
            source.url,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: Theme.of(context).colorScheme.primary,
            ),
          ),
        ],
      ),
    ),
  );

  Future<void> _openUrl(BuildContext context, String url) async {
    final uri = Uri.parse(url);
    final launched = await launchUrl(uri, mode: LaunchMode.externalApplication);
    if (!launched && context.mounted) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Could not open $url')));
    }
  }
}
