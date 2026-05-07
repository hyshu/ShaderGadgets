import tgpu, { type TgpuRoot, common, d } from "typegpu";
import type {
  ShaderGadgetProgramOptions,
  ShaderGadgetSourceFactory,
  ShaderGadgetState,
} from "../../shaderGadgetCore";
import {
  EFFECT_PADDING,
  PANEL_SIZE,
  SOURCE_TEXTURE_SIZE,
  TEXTURE_SIZE,
} from "./metrics";

export type GlideMode = "glide";
export type GlideShaderGadgetState = ShaderGadgetState<GlideMode>;

type GlideShaderGadgetProgramOptions = ShaderGadgetProgramOptions<GlideMode> & {
  ownsRoot?: boolean;
};

const TransitionParams = d.struct({
  textureSize: d.vec2f,
  contentOrigin: d.vec2f,
  contentSize: d.vec2f,
  time: d.f32,
  angle: d.f32,
});

const transitionLayout = tgpu
  .bindGroupLayout({
    params: { uniform: TransitionParams },
    linearSampler: { sampler: "filtering" },
    sourceA: { texture: d.texture2d() },
    sourceB: { texture: d.texture2d() },
  })
  .$idx(0);

const hash21 = tgpu.fn([d.vec2f], d.f32)/* wgsl */ `(p) {
  var p3 = fract(vec3f(p.x, p.y, p.x) * vec3f(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + vec3f(33.33));
  return fract((p3.x + p3.y) * p3.z);
}`;

const sampleSourceA = tgpu
  .fn([d.vec2f], d.vec4f)/* wgsl */ `(pixel_pos) {
    if (pixel_pos.x < 0.0 || pixel_pos.x > params.contentSize.x || pixel_pos.y < 0.0 || pixel_pos.y > params.contentSize.y) {
      return vec4f(0.0);
    }
    return textureSampleLevel(sourceA, linearSampler, (params.contentOrigin + pixel_pos) / params.textureSize, 0.0);
  }`
  .$uses({
    params: transitionLayout.bound.params,
    linearSampler: transitionLayout.bound.linearSampler,
    sourceA: transitionLayout.bound.sourceA,
  });

const sampleSourceB = tgpu
  .fn([d.vec2f], d.vec4f)/* wgsl */ `(pixel_pos) {
    if (pixel_pos.x < 0.0 || pixel_pos.x > params.contentSize.x || pixel_pos.y < 0.0 || pixel_pos.y > params.contentSize.y) {
      return vec4f(0.0);
    }
    return textureSampleLevel(sourceB, linearSampler, (params.contentOrigin + pixel_pos) / params.textureSize, 0.0);
  }`
  .$uses({
    params: transitionLayout.bound.params,
    linearSampler: transitionLayout.bound.linearSampler,
    sourceB: transitionLayout.bound.sourceB,
  });

const glideSample = tgpu
  .fn([d.vec2f, d.f32], d.vec4f)/* wgsl */ `(position, time) {
    if (time <= 0.0) {
      return sample_source_a(position);
    }
    if (time >= 1.0) {
      return sample_source_b(position);
    }

    let block_id = floor(position);
    let r1 = hash21(block_id);
    let r2 = hash21(block_id + vec2f(127.1, 311.7));
    let r3 = hash21(block_id + vec2f(269.5, 183.3));
    let r4 = hash21(block_id + vec2f(419.2, 53.7));

    let uv = position / params.contentSize;
    let sweep_pos = (uv.x + (1.0 - uv.y)) * 0.5;
    let start_threshold = sweep_pos * 0.15 + r1 * 0.05;
    let local_progress = clamp((time - start_threshold) / (1.0 - start_threshold), 0.0, 1.0);

    let angle = params.angle + (r2 - 0.5) * 0.52;
    let dir = vec2f(cos(angle), sin(angle));
    let perp_dir = vec2f(-dir.y, dir.x);
    let max_dist = params.contentSize.y * 0.7 * (0.7 + r3 * 0.6);
    let eased = smoothstep(0.0, 1.0, local_progress);
    let mag = eased * max_dist;
    let sway_amplitude = (r4 - 0.5) * 30.0;
    let wobble = sin(local_progress * 3.14159265) * sway_amplitude;

    let sample_pos_a = position - dir * mag + perp_dir * wobble;
    let sample_pos_b = position + dir * (max_dist - mag) + perp_dir * wobble;
    let a = sample_source_a(sample_pos_a);
    let b = sample_source_b(sample_pos_b);
    let blend = smoothstep(0.0, 1.0, local_progress);
    return mix(a, b, blend);
  }`
  .$uses({
    params: transitionLayout.bound.params,
    hash21,
    sample_source_a: sampleSourceA,
    sample_source_b: sampleSourceB,
  });

const transitionFragment = tgpu
  .fragmentFn({
    in: { uv: d.vec2f },
    out: d.vec4f,
  })/* wgsl */ `{
    let texture_position = in.uv * params.textureSize;
    let position = texture_position - params.contentOrigin;
    let t = clamp(params.time, 0.0, 1.0);

    return glide_sample(position, t);
  }`
  .$uses({
    params: transitionLayout.bound.params,
    glide_sample: glideSample,
  });

export class GlideShaderGadgetProgram {
  private readonly root: TgpuRoot;
  private readonly context: GPUCanvasContext;
  private readonly ownsRoot: boolean;
  private readonly present?: () => void;
  private readonly sourceFactory: ShaderGadgetSourceFactory<GlideMode>;
  private readonly transitionParams;
  private readonly sampler;
  private readonly transitionPipeline;
  private readonly textureA;
  private readonly textureB;
  private readonly transitionBindGroup;
  private sourceMode: GlideMode = "glide";

  constructor({
    root,
    context,
    ownsRoot = true,
    presentationFormat,
    sourceFactory,
    present,
  }: GlideShaderGadgetProgramOptions) {
    this.root = root;
    this.context = context;
    this.ownsRoot = ownsRoot;
    this.present = present;
    this.sourceFactory = sourceFactory;

    this.transitionParams = root.createUniform(TransitionParams, {
      textureSize: d.vec2f(TEXTURE_SIZE, TEXTURE_SIZE),
      contentOrigin: d.vec2f(EFFECT_PADDING, EFFECT_PADDING),
      contentSize: d.vec2f(PANEL_SIZE, PANEL_SIZE),
      time: 0,
      angle: Math.PI / 2,
    });
    this.sampler = root.createSampler({
      magFilter: "linear",
      minFilter: "linear",
      addressModeU: "clamp-to-edge",
      addressModeV: "clamp-to-edge",
    });

    this.textureA = root
      .createTexture({
        size: [SOURCE_TEXTURE_SIZE, SOURCE_TEXTURE_SIZE],
        format: "rgba8unorm",
      })
      .$usage("render", "sampled");
    this.textureB = root
      .createTexture({
        size: [SOURCE_TEXTURE_SIZE, SOURCE_TEXTURE_SIZE],
        format: "rgba8unorm",
      })
      .$usage("render", "sampled");

    this.transitionBindGroup = root.createBindGroup(transitionLayout, {
      params: this.transitionParams.buffer,
      linearSampler: this.sampler,
      sourceA: this.textureA.createView(),
      sourceB: this.textureB.createView(),
    });

    this.transitionPipeline = root.createRenderPipeline({
      vertex: common.fullScreenTriangle,
      fragment: transitionFragment,
      targets: { format: presentationFormat },
    });

    this.renderSources("glide");
  }

  resize(_width: number, _height: number) {}

  render(state: GlideShaderGadgetState) {
    if (this.sourceMode !== state.mode) {
      this.renderSources(state.mode);
    }

    this.transitionParams.write({
      textureSize: d.vec2f(TEXTURE_SIZE, TEXTURE_SIZE),
      contentOrigin: d.vec2f(EFFECT_PADDING, EFFECT_PADDING),
      contentSize: d.vec2f(PANEL_SIZE, PANEL_SIZE),
      time: state.time,
      angle: (state.angleDeg * Math.PI) / 180,
    });

    this.transitionPipeline
      .with(this.transitionBindGroup)
      .withColorAttachment({
        view: this.context,
        clearValue: [1, 1, 1, 1],
        loadOp: "clear",
        storeOp: "store",
      })
      .draw(3);

    this.present?.();
  }

  destroy() {
    if (this.ownsRoot) {
      this.root.destroy();
    }
  }

  private renderSources(mode: GlideMode) {
    const writeTexture = (texture: typeof this.textureA, variant: 0 | 1) => {
      (texture.write as (source: unknown) => void)(
        this.sourceFactory(mode, variant),
      );
    };

    this.sourceMode = mode;
    writeTexture(this.textureA, 0);
    writeTexture(this.textureB, 1);
  }
}
