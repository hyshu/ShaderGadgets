import type { ShaderGadgetState, TransitionMode } from "./types";
import type { GadgetInfo } from "./info";

export type GadgetDefinition<TMode extends TransitionMode = TransitionMode> = {
  mode: TMode;
  label: string;
  info: GadgetInfo;
  defaultState: () => ShaderGadgetState<TMode>;
};

export const GADGETS: readonly GadgetDefinition[] = [];

export const INITIAL_GADGET: GadgetDefinition | undefined = GADGETS[0];

export function getGadget(mode: TransitionMode): GadgetDefinition | undefined {
  return GADGETS.find((gadget) => gadget.mode === mode) ?? INITIAL_GADGET;
}
