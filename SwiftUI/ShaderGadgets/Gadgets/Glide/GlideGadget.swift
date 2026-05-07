import SwiftUI

private let panelSize = CGSize(width: 280, height: 280)
private let glideInfo = GadgetInfo(
  sources: [
    GadgetInfoLink(
      label: "Original shader",
      url: URL(string: "https://x.com/du_yuan161/status/2047713364810555890")!
    ),
    GadgetInfoLink(
      label: "hash21 / Hash without Sine",
      url: URL(string: "https://www.shadertoy.com/view/4djSRW")!
    ),
  ],
  availableIn: ["SwiftUI", "React Native", "Web", "Flutter"]
)

struct GlideGadget: View {
  @Environment(\.displayScale) private var displayScale
  @State private var time: Double = 0
  @State private var snapshotB: Image?
  @State private var playTask: Task<Void, Never>?
  @State private var playbackRunID = 0

  var body: some View {
    VStack(spacing: 24) {
      Spacer()

      Group {
        if time >= 1 {
          viewB
        } else {
          viewA
            .frame(width: panelSize.width, height: panelSize.height)
            .layerEffect(
              ShaderLibrary.glide(
                .float2(panelSize),
                .float(Float(time)),
                .float(Float.pi / 2),  // 90° = ↓
                .image(snapshotB ?? Image(systemName: "questionmark"))
              ),
              maxSampleOffset: CGSize(width: 360, height: 360)
            )
        }
      }

      Spacer()

      GadgetControlPane {
        GadgetLabeledSlider(
          label: "time",
          value: $time,
          valueText: String(format: "%.3f", time)
        )

        GadgetPlaybackControls(
          isPlaying: playTask != nil,
          onTogglePlayback: togglePlayback,
          onReset: reset
        )
      }
    }
    .navigationTitle("Glide")
    .toolbar {
      ToolbarItem(placement: .topBarTrailing) {
        GadgetInfoButton(info: glideInfo)
      }
    }
    .task {
      snapshotB = renderGadgetSnapshot(viewB, scale: displayScale)
    }
    .onDisappear { playTask?.cancel() }
  }

  private func togglePlayback() {
    if playTask != nil {
      pause()
    } else {
      play()
    }
  }

  private func play() {
    playTask?.cancel()
    playbackRunID += 1
    let runID = playbackRunID
    time = 0
    playTask = Task { @MainActor in
      let start = Date()
      let duration: Double = 2.0
      while !Task.isCancelled {
        let elapsed = Date().timeIntervalSince(start)
        let t = min(elapsed / duration, 1.0)
        time = t
        if t >= 1.0 { break }
        try? await Task.sleep(nanoseconds: 16_000_000)
      }
      if playbackRunID == runID {
        playTask = nil
      }
    }
  }

  private func pause() {
    playbackRunID += 1
    playTask?.cancel()
    playTask = nil
  }

  private func reset() {
    playbackRunID += 1
    playTask?.cancel()
    playTask = nil
    time = 0
  }

  private var viewA: some View {
    Text("Use it")
      .font(.system(size: 72, weight: .heavy, design: .rounded))
      .foregroundStyle(
        LinearGradient(
          colors: [.purple, .pink, .orange, .yellow],
          startPoint: .leading,
          endPoint: .trailing
        )
      )
      .frame(
        width: panelSize.width,
        height: panelSize.height,
        alignment: .top
      )
      .padding(.top, 0)
  }

  private var viewB: some View {
    Text("Or lose it")
      .font(.system(size: 64, weight: .heavy, design: .rounded))
      .foregroundStyle(
        LinearGradient(
          colors: [.blue, .teal, .green, .mint],
          startPoint: .leading,
          endPoint: .trailing
        )
      )
      .frame(
        width: panelSize.width,
        height: panelSize.height,
        alignment: .bottom
      )
  }
}

#Preview {
  NavigationStack { GlideGadget() }
}
