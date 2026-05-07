import type {
  ShaderGadgetSourceFactory as CoreShaderGadgetSourceFactory,
  ShaderGadgetState as CoreShaderGadgetState,
} from "../shaderGadgetCore";
import type { GlideMode } from "./glide/shaderGadget";

export type TransitionMode = GlideMode;
export type ShaderGadgetState = CoreShaderGadgetState<TransitionMode>;
export type ShaderGadgetSourceFactory =
  CoreShaderGadgetSourceFactory<TransitionMode>;
