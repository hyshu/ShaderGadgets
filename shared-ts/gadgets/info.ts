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

export const GLIDE_GADGET_INFO = {
  sources: [
    {
      label: "Original shader",
      url: "https://x.com/du_yuan161/status/2047713364810555890",
    },
    {
      label: "hash21 / Hash without Sine",
      url: "https://www.shadertoy.com/view/4djSRW",
    },
  ],
  availableIn: ALL_GADGET_PLATFORMS,
} as const satisfies GadgetInfo;
