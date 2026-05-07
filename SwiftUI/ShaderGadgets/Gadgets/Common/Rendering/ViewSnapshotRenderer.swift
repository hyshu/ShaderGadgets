import SwiftUI

@MainActor
func renderGadgetSnapshot<V: View>(_ view: V, scale: CGFloat) -> Image? {
  let renderer = ImageRenderer(content: view)
  renderer.scale = scale
  guard let cgImage = renderer.cgImage else { return nil }
  return Image(decorative: cgImage, scale: scale)
}
