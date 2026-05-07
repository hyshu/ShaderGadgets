import {
  ImageFormat,
  PaintStyle,
  Skia,
  TileMode,
  matchFont,
  type SkCanvas,
  type SkFont,
  type SkPaint,
} from "@shopify/react-native-skia";
import { Platform } from "react-native";
import {
  EFFECT_PADDING,
  PANEL_SIZE,
  SOURCE_TEXTURE_SCALE,
  SOURCE_TEXTURE_SIZE,
} from "../../../../shared-ts/gadgets/glide";

const TEXT_LINE_HEIGHT = 1.16;
const TEXT_HORIZONTAL_INSET = 8;
const TEXT_FONT_FAMILY = Platform.OS === "android" ? "sans-serif" : "System";

type GradientTextSpec = {
  text: string;
  fontSize: number;
  vertical: "top" | "bottom";
  colors: readonly string[];
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

export async function loadGlideSources(): Promise<
  readonly [ImageBitmap, ImageBitmap]
> {
  return Promise.all([
    createGlideSourceBitmap(glideSourceSpec),
    createGlideSourceBitmap(glideTargetSpec),
  ]);
}

async function createGlideSourceBitmap(spec: GradientTextSpec) {
  const surface = Skia.Surface.Make(SOURCE_TEXTURE_SIZE, SOURCE_TEXTURE_SIZE);
  if (!surface) {
    throw new Error("Skia surface is not available.");
  }

  const canvas = surface.getCanvas();
  canvas.clear(Skia.Color("rgba(0, 0, 0, 0)"));
  drawGradientText(canvas, spec);
  surface.flush();

  const image = surface.makeImageSnapshot();
  const bytes = image.encodeToBytes(ImageFormat.PNG, 100);
  image.dispose();
  surface.dispose();

  const decodeImageBitmap = createImageBitmap as unknown as (
    image: Uint8Array,
  ) => Promise<ImageBitmap>;
  return decodeImageBitmap(bytes);
}

function drawGradientText(canvas: SkCanvas, spec: GradientTextSpec) {
  const scale = SOURCE_TEXTURE_SCALE;
  const paint = createTextPaint(spec, scale);
  const { bounds, font, fontSize } = createFittedTextFont(spec, paint, scale);
  const metrics = font.getMetrics();
  const ascent = Math.max(0, -bounds.y) || Math.abs(metrics.ascent);
  const descent = Math.max(0, bounds.y + bounds.height) || metrics.descent;
  const textHeight = ascent + descent;
  const lineHeight = fontSize * TEXT_LINE_HEIGHT;
  const lineTop =
    (EFFECT_PADDING +
      (spec.vertical === "top"
        ? 0
        : PANEL_SIZE - (fontSize / scale) * TEXT_LINE_HEIGHT)) *
    scale;
  const glyphTop = lineTop + Math.max(0, (lineHeight - textHeight) / 2);
  const x =
    (EFFECT_PADDING + PANEL_SIZE / 2) * scale - bounds.width / 2 - bounds.x;
  const y = glyphTop + ascent;

  canvas.drawText(spec.text, x, y, paint, font);
  font.dispose();
  paint.dispose();
}

function createFittedTextFont(
  spec: GradientTextSpec,
  paint: SkPaint,
  scale: number,
) {
  const maxWidth = (PANEL_SIZE - TEXT_HORIZONTAL_INSET * 2) * scale;
  let fontSize = spec.fontSize * scale;
  let font = createTextFont(fontSize);
  let bounds = font.measureText(spec.text, paint);

  if (bounds.width > maxWidth) {
    font.dispose();
    fontSize = Math.floor(fontSize * (maxWidth / bounds.width));
    font = createTextFont(fontSize);
    bounds = font.measureText(spec.text, paint);
  }

  return { bounds, font, fontSize };
}

function createTextFont(size: number): SkFont {
  return matchFont({
    fontFamily: TEXT_FONT_FAMILY,
    fontSize: size,
    fontStyle: "normal",
    fontWeight: "900",
  });
}

function createTextPaint(spec: GradientTextSpec, scale: number): SkPaint {
  const paint = Skia.Paint();
  paint.setAntiAlias(true);
  paint.setStyle(PaintStyle.Fill);
  paint.setShader(
    Skia.Shader.MakeLinearGradient(
      Skia.Point(
        EFFECT_PADDING * scale,
        (EFFECT_PADDING + PANEL_SIZE / 2) * scale,
      ),
      Skia.Point(
        (EFFECT_PADDING + PANEL_SIZE) * scale,
        (EFFECT_PADDING + PANEL_SIZE / 2) * scale,
      ),
      spec.colors.map((color) => Skia.Color(color)),
      spec.colors.map((_, index) =>
        spec.colors.length <= 1 ? 0 : index / (spec.colors.length - 1),
      ),
      TileMode.Clamp,
    ),
  );
  return paint;
}
