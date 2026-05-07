import {
  EFFECT_PADDING,
  PANEL_SIZE,
  SOURCE_TEXTURE_SCALE,
  SOURCE_TEXTURE_SIZE,
  TEXTURE_SIZE,
} from "../../../../shared-ts/gadgets/glide";

const TEXT_LINE_HEIGHT = 1.16;
const TEXT_HORIZONTAL_INSET = 8;

type GradientTextSpec = {
  text: string;
  fontSize: number;
  vertical: "top" | "bottom";
  colors: string[];
};

const glideSourceSpec: GradientTextSpec = {
  text: "Use it",
  fontSize: 72,
  vertical: "top",
  colors: ["#9C27B0", "#E91E63", "#FF9800", "#FFEB3B"],
};

const glideTargetSpec: GradientTextSpec = {
  text: "Or lose it",
  fontSize: 64,
  vertical: "bottom",
  colors: ["#2196F3", "#009688", "#4CAF50", "#80CBC4"],
};

export function createGlideSourceCanvas(variant: 0 | 1) {
  const canvas = document.createElement("canvas");
  canvas.width = SOURCE_TEXTURE_SIZE;
  canvas.height = SOURCE_TEXTURE_SIZE;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas2D is not available.");
  }

  ctx.scale(SOURCE_TEXTURE_SCALE, SOURCE_TEXTURE_SCALE);
  ctx.clearRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);
  drawGradientText(ctx, variant === 0 ? glideSourceSpec : glideTargetSpec);

  return canvas;
}

function drawGradientText(ctx: CanvasRenderingContext2D, spec: GradientTextSpec) {
  ctx.save();
  ctx.font = `900 ${spec.fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  const fontSize = fitFontSize(ctx, spec);
  const metrics = ctx.measureText(spec.text);
  const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.8;
  const descent = metrics.actualBoundingBoxDescent || fontSize * 0.2;
  const textHeight = ascent + descent;
  const lineHeight = fontSize * TEXT_LINE_HEIGHT;
  const x = EFFECT_PADDING + PANEL_SIZE / 2;
  const lineTop =
    EFFECT_PADDING + (spec.vertical === "top" ? 0 : PANEL_SIZE - lineHeight);
  const glyphTop = lineTop + Math.max(0, (lineHeight - textHeight) / 2);
  const y = glyphTop + ascent;
  const gradient = ctx.createLinearGradient(
    EFFECT_PADDING,
    EFFECT_PADDING + PANEL_SIZE / 2,
    EFFECT_PADDING + PANEL_SIZE,
    EFFECT_PADDING + PANEL_SIZE / 2,
  );

  spec.colors.forEach((color, index) => {
    gradient.addColorStop(
      spec.colors.length <= 1 ? 0 : index / (spec.colors.length - 1),
      color,
    );
  });

  ctx.fillStyle = gradient;
  ctx.fillText(spec.text, x, y);
  ctx.restore();
}

function fitFontSize(ctx: CanvasRenderingContext2D, spec: GradientTextSpec) {
  const maxWidth = PANEL_SIZE - TEXT_HORIZONTAL_INSET * 2;
  const metrics = ctx.measureText(spec.text);

  if (metrics.width <= maxWidth) {
    return spec.fontSize;
  }

  const fontSize = Math.floor(spec.fontSize * (maxWidth / metrics.width));
  ctx.font = `900 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  return fontSize;
}
