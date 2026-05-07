import type { ShaderGadgetState, TransitionMode } from "./types";
import { GLIDE_GADGET_INFO, type GadgetInfo } from "./info";

export type GadgetDefinition = {
  mode: TransitionMode;
  label: string;
  info: GadgetInfo;
  defaultState: () => ShaderGadgetState;
};

export const GADGETS = [
  {
    mode: "glide",
    label: "Glide",
    info: GLIDE_GADGET_INFO,
    defaultState: () => ({
      mode: "glide",
      time: 0,
      angleDeg: 90,
    }),
  },
] as const satisfies readonly GadgetDefinition[];

export const INITIAL_GADGET = GADGETS[0];

export function getGadget(mode: TransitionMode): GadgetDefinition {
  return GADGETS.find((gadget) => gadget.mode === mode) ?? INITIAL_GADGET;
}
