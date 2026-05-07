import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ShaderGadgetSourceFactory } from "../../../shared-ts/gadgets";
import { GadgetControls } from "./GadgetControls";
import { ShaderGadgetCanvas } from "./ShaderGadgetCanvas";
import { getGadget } from "./gadgetCatalog";
import type { RootStackParamList } from "./navigationTypes";

type Props = NativeStackScreenProps<RootStackParamList, "GadgetRunner"> & {
  error: string | null;
  sourceFactory: ShaderGadgetSourceFactory | null;
};

const PLAY_DURATION_MS = 2000;

export function GadgetRunner({ error, route, sourceFactory }: Props) {
  const mode = route.params.mode;
  const frameRef = useRef<number | null>(null);
  const playStartRef = useRef(0);
  const insets = useSafeAreaInsets();
  const [state, setState] = useState(() => getGadget(mode).defaultState());
  const stateRef = useRef(state);
  const [isPlaying, setIsPlaying] = useState(false);

  const stopPlayback = useCallback(() => {
    setIsPlaying(false);
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  useEffect(() => {
    stopPlayback();
    setState(getGadget(mode).defaultState());
  }, [mode, stopPlayback]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, [stopPlayback]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const tick = (now: number) => {
      const time = Math.min((now - playStartRef.current) / PLAY_DURATION_MS, 1);
      setState((current) => ({ ...current, time }));

      if (time < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        frameRef.current = null;
        setIsPlaying(false);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [isPlaying]);

  const updateTime = useCallback(
    (time: number) => {
      stopPlayback();
      setState((current) => ({ ...current, time }));
    },
    [stopPlayback],
  );

  const play = useCallback(() => {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    const startTime = stateRef.current.time >= 1 ? 0 : stateRef.current.time;
    setState((current) => ({ ...current, time: startTime }));
    playStartRef.current = performance.now() - startTime * PLAY_DURATION_MS;
    setIsPlaying(true);
  }, [isPlaying, stopPlayback]);

  const reset = useCallback(() => {
    stopPlayback();
    setState(getGadget(mode).defaultState());
  }, [mode, stopPlayback]);

  return (
    <View style={styles.detailScreen}>
      <View style={styles.previewSlot}>
        <View style={styles.preview}>
          {sourceFactory ? (
            <ShaderGadgetCanvas state={state} sourceFactory={sourceFactory} />
          ) : (
            <View style={styles.loading}>
              {error ? (
                <Text style={styles.error}>{error}</Text>
              ) : (
                <ActivityIndicator />
              )}
            </View>
          )}
        </View>
      </View>

      <View
        style={[
          styles.controls,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <GadgetControls
          isPlaying={isPlaying}
          onPlay={play}
          onReset={reset}
          onTimeChange={updateTime}
          time={state.time}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  detailScreen: {
    flex: 1,
    paddingHorizontal: 24,
  },
  previewSlot: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    minHeight: 340,
  },
  preview: {
    aspectRatio: 1,
    maxWidth: "100%",
    overflow: "hidden",
    width: 340,
  },
  loading: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  error: {
    color: "#b91c1c",
    fontSize: 14,
    padding: 16,
    textAlign: "center",
  },
  controls: {
    marginHorizontal: -16,
  },
});
