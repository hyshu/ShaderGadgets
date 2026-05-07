import SwiftUI

struct GadgetControlPane<Content: View>: View {
  private let content: Content

  init(@ViewBuilder content: () -> Content) {
    self.content = content()
  }

  var body: some View {
    VStack(spacing: 12) {
      content
    }
    .padding(.horizontal, 24)
    .padding(.bottom, 32)
  }
}

#Preview {
  GadgetControlPane {
    GadgetLabeledSlider(
      label: "time",
      value: .constant(0.5),
      valueText: "0.500"
    )
    GadgetPlaybackControls(
      isPlaying: false,
      onTogglePlayback: {},
      onReset: {}
    )
  }
}
