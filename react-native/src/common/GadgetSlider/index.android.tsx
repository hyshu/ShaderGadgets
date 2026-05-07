import { Host, Slider } from "@expo/ui/jetpack-compose";
import { StyleSheet } from "react-native";
import type { NativeGadgetSliderProps } from "./types";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function quantize(value: number, step: number, min: number, max: number): number {
  return clamp(Math.round((value - min) / step) * step + min, min, max);
}

export function NativeGadgetSlider({
  max,
  min,
  onValueChange,
  step,
  value,
}: NativeGadgetSliderProps) {
  return (
    <Host colorScheme="light" style={styles.host}>
      <Slider
        colors={{
          activeTrackColor: "#2563eb",
          inactiveTrackColor: "#d4d4d4",
          thumbColor: "#2563eb",
        }}
        max={max}
        min={min}
        onValueChange={(nextValue) =>
          onValueChange(quantize(nextValue, step, min, max))
        }
        steps={0}
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
