import SwiftUI

struct GadgetInfoButton: View {
  let info: GadgetInfo
  @State private var isPresented = false

  var body: some View {
    Button {
      isPresented = true
    } label: {
      Image(systemName: "info.circle")
    }
    .accessibilityLabel("Gadget information")
    .popover(isPresented: $isPresented, arrowEdge: .top) {
      GadgetInfoPopover(info: info)
        .frame(width: 360)
        .presentationCompactAdaptation(.popover)
    }
  }
}

private struct GadgetInfoPopover: View {
  let info: GadgetInfo

  var body: some View {
    VStack(alignment: .leading, spacing: 20) {
      Text("Info")
        .font(.title2.weight(.bold))

      VStack(alignment: .leading, spacing: 10) {
        SectionTitle("Sources")

        VStack(alignment: .leading, spacing: 8) {
          ForEach(info.sources) { source in
            Link(destination: source.url) {
              VStack(alignment: .leading, spacing: 4) {
                Text(source.label)
                  .font(.headline)
                  .foregroundStyle(.primary)
                Text(source.url.absoluteString)
                  .font(.caption)
                  .lineLimit(2)
                  .foregroundStyle(.blue)
              }
              .frame(maxWidth: .infinity, alignment: .leading)
              .padding(12)
              .background(
                RoundedRectangle(cornerRadius: 8)
                  .stroke(.quaternary, lineWidth: 1)
              )
            }
          }
        }
      }

      VStack(alignment: .leading, spacing: 8) {
        SectionTitle("Available")

        Text(info.availableIn.joined(separator: ", "))
          .font(.subheadline)
          .foregroundStyle(.secondary)
      }
    }
    .padding(20)
  }
}

private struct SectionTitle: View {
  let text: LocalizedStringKey

  init(_ text: LocalizedStringKey) {
    self.text = text
  }

  var body: some View {
    Text(text)
      .font(.caption.weight(.bold))
      .foregroundStyle(.secondary)
      .textCase(.uppercase)
  }
}

#Preview {
  GadgetInfoButton(
    info: GadgetInfo(
      sources: [
        GadgetInfoLink(
          label: "Original shader",
          url: URL(string: "https://example.com")!
        )
      ],
      availableIn: ["SwiftUI", "React Native", "Web", "Flutter"]
    )
  )
}
