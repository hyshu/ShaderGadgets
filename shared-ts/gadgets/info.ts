export type GadgetPlatform = "SwiftUI" | "React Native" | "Web" | "Flutter";

export type GadgetInfoLink = {
  label: string;
  url: string;
};

export type GadgetInfo = {
  sources: readonly GadgetInfoLink[];
  availableIn: readonly GadgetPlatform[];
};

export const ALL_GADGET_PLATFORMS = [
  "SwiftUI",
  "React Native",
  "Web",
  "Flutter",
] as const satisfies readonly GadgetPlatform[];
