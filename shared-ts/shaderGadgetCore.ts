import type { TgpuRoot } from "typegpu";

export type ShaderGadgetState<TMode extends string = string> = {
  time: number;
  angleDeg: number;
  mode: TMode;
};

export type ShaderGadgetSourceFactory<TMode extends string = string> = (
  mode: TMode,
  variant: 0 | 1,
) => unknown;

export type ShaderGadgetProgramOptions<TMode extends string = string> = {
  root: TgpuRoot;
  context: GPUCanvasContext;
  presentationFormat: GPUTextureFormat;
  sourceFactory: ShaderGadgetSourceFactory<TMode>;
  present?: () => void;
};
