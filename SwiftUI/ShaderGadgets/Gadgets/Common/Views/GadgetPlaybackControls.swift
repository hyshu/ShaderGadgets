import SwiftUI

private struct GadgetPlayPauseButton: View {
  let isPlaying: Bool
  let action: () -> Void

  var body: some View {
    Button(action: action) {
      Label(
        isPlaying ? "Pause" : "Play",
        systemImage: isPlaying ? "pause.fill" : "play.fill"
      )
        .frame(maxWidth: .infinity)
    }
    .buttonStyle(.borderedProminent)
  }
}

struct GadgetPlaybackControls: View {
  let isPlaying: Bool
  let onTogglePlayback: () -> Void
  let onReset: () -> Void

  var body: some View {
    HStack(spacing: 8) {
      GadgetPlayPauseButton(isPlaying: isPlaying, action: onTogglePlayback)

      Button(action: onReset) {
        Label("Reset", systemImage: "arrow.counterclockwise")
      }
      .buttonStyle(.bordered)
    }
  }
}

#Preview {
  VStack {
    GadgetPlaybackControls(
      isPlaying: false,
      onTogglePlayback: {},
      onReset: {}
    )
    GadgetPlaybackControls(
      isPlaying: true,
      onTogglePlayback: {},
      onReset: {}
    )
  }
  .padding()
}
