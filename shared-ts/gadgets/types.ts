import type {
  ShaderGadgetSourceFactory as CoreShaderGadgetSourceFactory,
  ShaderGadgetState as CoreShaderGadgetState,
} from "../shaderGadgetCore";

export type TransitionMode = string;
export type ShaderGadgetState<TMode extends TransitionMode = TransitionMode> =
  CoreShaderGadgetState<TMode>;
export type ShaderGadgetSourceFactory =
  CoreShaderGadgetSourceFactory<TransitionMode>;
