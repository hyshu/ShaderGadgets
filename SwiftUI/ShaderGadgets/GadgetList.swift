import SwiftUI

struct GadgetList: View {
  var body: some View {
    NavigationStack {
      List {
        Text("No gadgets yet.")
          .foregroundStyle(.secondary)
      }
      .navigationTitle("Shader Gadgets")
    }
  }
}

#Preview {
  GadgetList()
}
