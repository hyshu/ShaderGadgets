import type {
  GadgetDefinition,
  ShaderGadgetSourceFactory,
  TransitionMode,
} from "../../../shared-ts/gadgets";
import { GADGETS as SHARED_GADGETS } from "../../../shared-ts/gadgets";
import { loadGlideSources } from "../gadgets/glide/sources";

export type Gadget = GadgetDefinition & {
  loadSources: () => Promise<readonly [ImageBitmap, ImageBitmap]>;
};

export type SourceMap = Record<TransitionMode, readonly [ImageBitmap, ImageBitmap]>;

const sourceLoaders = {
  glide: loadGlideSources,
} as const satisfies Record<
  TransitionMode,
  () => Promise<readonly [ImageBitmap, ImageBitmap]>
>;

export const GADGETS = SHARED_GADGETS.map((gadget) => ({
  ...gadget,
  loadSources: sourceLoaders[gadget.mode],
})) satisfies readonly Gadget[];

export function getGadget(mode: TransitionMode): Gadget {
  return GADGETS.find((gadget) => gadget.mode === mode) ?? GADGETS[0];
}

export async function loadShaderSources(): Promise<SourceMap> {
  const entries = await Promise.all(
    GADGETS.map(async (gadget) => {
      const [sourceA, sourceB] = await gadget.loadSources();

      return [gadget.mode, [sourceA, sourceB] as const] as const;
    }),
  );

  return Object.fromEntries(entries) as SourceMap;
}

export function createSourceFactory(
  sources: SourceMap,
): ShaderGadgetSourceFactory {
  return (mode, variant) => sources[mode][variant];
}
