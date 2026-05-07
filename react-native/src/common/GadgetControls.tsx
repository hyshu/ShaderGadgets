import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NativeGadgetSlider } from "./GadgetSlider";

type ValueHeaderProps = {
  label: string;
  value: string;
};

function ValueHeader({ label, value }: ValueHeaderProps) {
  return (
    <View style={styles.valueHeader}>
      <Text style={styles.valueLabel}>{label}</Text>
      <Text style={styles.valueNumber}>{value}</Text>
    </View>
  );
}

type GadgetSliderProps = {
  displayValue: string;
  label: string;
  max: number;
  min: number;
  onValueChange: (value: number) => void;
  step: number;
  value: number;
};

function GadgetSlider({
  displayValue,
  label,
  max,
  min,
  onValueChange,
  step,
  value,
}: GadgetSliderProps) {
  return (
    <View style={styles.sliderGroup}>
      <ValueHeader label={label} value={displayValue} />
      <NativeGadgetSlider
        accessibilityLabel={label}
        max={max}
        min={min}
        onValueChange={onValueChange}
        step={step}
        value={value}
      />
    </View>
  );
}

type PlaybackControlsProps = {
  isPlaying: boolean;
  onPlay: () => void;
  onReset: () => void;
};

function PlaybackControls({
  isPlaying,
  onPlay,
  onReset,
}: PlaybackControlsProps) {
  return (
    <View style={styles.playback}>
      <Pressable
        accessibilityRole="button"
        onPress={onPlay}
        style={({ pressed }) => [
          styles.playButton,
          pressed ? styles.buttonPressed : null,
        ]}
      >
        <Text style={styles.playButtonText}>
          {isPlaying ? "Pause" : "Play"}
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={onReset}
        style={({ pressed }) => [
          styles.resetButton,
          pressed ? styles.buttonPressed : null,
        ]}
      >
        <Text style={styles.resetButtonText}>Reset</Text>
      </Pressable>
    </View>
  );
}

type GadgetControlsProps = {
  framed?: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onReset: () => void;
  onTimeChange: (time: number) => void;
  time: number;
};

export function GadgetControls({
  framed = false,
  isPlaying,
  onPlay,
  onReset,
  onTimeChange,
  time,
}: GadgetControlsProps) {
  return (
    <View style={[styles.panel, framed ? styles.panelFramed : null]}>
      <GadgetSlider
        displayValue={time.toFixed(3)}
        label="time"
        max={1}
        min={0}
        onValueChange={onTimeChange}
        step={0.001}
        value={time}
      />

      <PlaybackControls
        isPlaying={isPlaying}
        onPlay={onPlay}
        onReset={onReset}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonPressed: {
    opacity: 0.55,
  },
  panel: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    gap: 20,
    padding: 16,
  },
  panelFramed: {
    borderColor: "#d4d4d4",
    borderWidth: StyleSheet.hairlineWidth,
  },
  playButton: {
    alignItems: "center",
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    height: 44,
    justifyContent: "center",
  },
  playButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  playback: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 4,
  },
  resetButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#d4d4d4",
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  resetButtonText: {
    color: "#404040",
    fontSize: 16,
    fontWeight: "700",
  },
  sliderGroup: {
    gap: 8,
  },
  valueHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  valueLabel: {
    color: "#404040",
    fontSize: 15,
    fontWeight: "500",
  },
  valueNumber: {
    color: "#171717",
    fontSize: 15,
    fontVariant: ["tabular-nums"],
    fontWeight: "500",
  },
});
