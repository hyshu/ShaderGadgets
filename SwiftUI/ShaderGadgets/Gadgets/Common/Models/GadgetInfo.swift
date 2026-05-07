import Foundation

struct GadgetInfo {
  let sources: [GadgetInfoLink]
  let availableIn: [String]
}

struct GadgetInfoLink: Identifiable {
  let label: String
  let url: URL

  var id: String { url.absoluteString }
}
