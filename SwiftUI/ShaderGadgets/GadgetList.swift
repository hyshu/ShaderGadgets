import SwiftUI

struct GadgetList: View {
  var body: some View {
    NavigationStack {
      List {
        NavigationLink("Glide") {
          GlideGadget()
        }
      }
      .navigationTitle("Shader Gadgets")
    }
  }
}

#Preview {
  GadgetList()
}
