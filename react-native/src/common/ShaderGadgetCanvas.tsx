import { useEffect, useRef } from "react";
import { PixelRatio, StyleSheet } from "react-native";
import { Canvas, type CanvasRef } from "react-native-wgpu";
import tgpu from "typegpu";
import {
  ShaderGadgetProgram,
  type ShaderGadgetSourceFactory,
  type ShaderGadgetState,
} from "../../../shared-ts/gadgets";

type PresentableGPUCanvasContext = GPUCanvasContext & {
  present?: () => void;
};

type NativeCanvas = {
  width: number;
  height: number;
  clientWidth: number;
  clientHeight: number;
};

type ShaderGadgetCanvasProps = {
  state: ShaderGadgetState;
  sourceFactory: ShaderGadgetSourceFactory;
};

export function ShaderGadgetCanvas({
  state,
  sourceFactory,
}: ShaderGadgetCanvasProps) {
  const canvasRef = useRef<CanvasRef>(null);
  const stateRef = useRef(state);
  const programRef = useRef<ShaderGadgetProgram | null>(null);

  useEffect(() => {
    stateRef.current = state;
    programRef.current?.render(state);
  }, [state]);

  useEffect(() => {
    let cancelled = false;
    let program: ShaderGadgetProgram | null = null;

    const createProgram = async () => {
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter || cancelled) {
        return;
      }

      const device = await adapter.requestDevice();
      const context = canvasRef.current?.getContext("webgpu");
      if (!context || cancelled) {
        return;
      }

      const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
      const presentableContext = context as PresentableGPUCanvasContext;
      const root = tgpu.initFromDevice({ device });

      const canvas = context.canvas as unknown as NativeCanvas;
      canvas.width = Math.max(
        1,
        Math.round(canvas.clientWidth * PixelRatio.get()),
      );
      canvas.height = Math.max(
        1,
        Math.round(canvas.clientHeight * PixelRatio.get()),
      );

      context.configure({
        device,
        format: presentationFormat,
        alphaMode: "premultiplied",
      });

      program = new ShaderGadgetProgram({
        root,
        context,
        presentationFormat,
        sourceFactory,
        present: () => presentableContext.present?.(),
      });

      programRef.current = program;
      program.render(stateRef.current);
    };

    void createProgram();

    return () => {
      cancelled = true;
      program?.destroy();
      programRef.current = null;
    };
  }, [sourceFactory]);

  return <Canvas ref={canvasRef} style={styles.canvas} transparent />;
}

const styles = StyleSheet.create({
  canvas: {
    aspectRatio: 1,
    width: "100%",
  },
});
