import SwiftUI

struct GadgetLabeledSlider: View {
  let label: LocalizedStringKey
  @Binding var value: Double
  let range: ClosedRange<Double>
  let valueText: String

  init(
    label: LocalizedStringKey,
    value: Binding<Double>,
    in range: ClosedRange<Double> = 0...1,
    valueText: String
  ) {
    self.label = label
    self._value = value
    self.range = range
    self.valueText = valueText
  }

  var body: some View {
    VStack(spacing: 0) {
      HStack {
        Text(label)
          .font(.system(.subheadline, design: .monospaced))
        Spacer()
        Text(valueText)
          .font(.system(.subheadline, design: .monospaced))
      }

      Slider(value: $value, in: range)
    }
  }
}

#Preview {
  GadgetLabeledSlider(
    label: "time",
    value: .constant(0.5),
    valueText: "0.500"
  )
  .padding()
}
