import { useState } from "react";
import {
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
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
  const [width, setWidth] = useState(0);
  const progress = (value - min) / (max - min);

  const updateFromLocation = (locationX: number) => {
    if (width <= 0) {
      return;
    }

    const nextValue = min + clamp(locationX / width, 0, 1) * (max - min);
    onValueChange(quantize(nextValue, step, min, max));
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="adjustable"
      onLayout={handleLayout}
      onPress={(event) => updateFromLocation(event.nativeEvent.locationX)}
      style={styles.track}
    >
      <View
        style={[
          styles.activeTrack,
          { width: `${clamp(progress, 0, 1) * 100}%` },
        ]}
      />
      <View
        style={[
          styles.thumb,
          { left: `${clamp(progress, 0, 1) * 100}%` },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  activeTrack: {
    backgroundColor: "#2563eb",
    borderRadius: 2,
    height: 4,
  },
  thumb: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    height: 20,
    marginLeft: -10,
    marginTop: -12,
    position: "absolute",
    top: "50%",
    width: 20,
  },
  track: {
    backgroundColor: "#d4d4d4",
    borderRadius: 2,
    height: 4,
    justifyContent: "center",
    marginVertical: 19,
  },
});
