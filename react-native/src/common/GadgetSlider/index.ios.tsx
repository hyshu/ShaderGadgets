import { Host, Slider } from "@expo/ui/swift-ui";
import {
  accessibilityLabel as swiftUIAccessibilityLabel,
} from "@expo/ui/swift-ui/modifiers";
import { StyleSheet } from "react-native";
import type { NativeGadgetSliderProps } from "./types";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function quantize(value: number, step: number, min: number, max: number): number {
  return clamp(Math.round((value - min) / step) * step + min, min, max);
}

export function NativeGadgetSlider({
  accessibilityLabel,
  max,
  min,
  onValueChange,
  step,
  value,
}: NativeGadgetSliderProps) {
  return (
    <Host style={styles.host}>
      <Slider
        max={max}
        min={min}
        modifiers={[swiftUIAccessibilityLabel(accessibilityLabel)]}
        onValueChange={(nextValue) =>
          onValueChange(quantize(nextValue, step, min, max))
        }
        value={value}
      />
    </Host>
  );
}

const styles = StyleSheet.create({
  host: {
    height: 42,
    width: "100%",
  },
});
