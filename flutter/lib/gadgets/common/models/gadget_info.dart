import 'package:flutter/foundation.dart';

@immutable
class GadgetInfo {
  const GadgetInfo({required this.sources, required this.availableIn});

  final List<GadgetInfoLink> sources;
  final List<String> availableIn;
}

@immutable
class GadgetInfoLink {
  const GadgetInfoLink({required this.label, required this.url});

  final String label;
  final String url;
}
