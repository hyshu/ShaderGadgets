import tgpu from "typegpu";
import {
  ShaderGadgetProgram,
  type ShaderGadgetState,
  type TransitionMode,
} from "../../../../shared-ts/gadgets";
import { createGlideSourceCanvas } from "../../gadgets/glide/sourceCanvas";

export type {
  ShaderGadgetState,
  TransitionMode,
} from "../../../../shared-ts/gadgets";

function createSourceCanvas(mode: TransitionMode, variant: 0 | 1) {
  switch (mode) {
    case "glide":
      return createGlideSourceCanvas(variant);
    default: {
      const unreachable: never = mode;
      throw new Error(`Unsupported gadget mode: ${unreachable}`);
    }
  }
}

export class ShaderGadgetRenderer {
  private readonly program: ShaderGadgetProgram;

  private constructor(program: ShaderGadgetProgram) {
    this.program = program;
  }

  static async create(canvas: HTMLCanvasElement) {
    if (!navigator.gpu) {
      throw new Error("WebGPU is not available in this browser.");
    }

    const root = await tgpu.init();
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    const context = root.configureContext({
      canvas,
      alphaMode: "premultiplied",
      format: presentationFormat,
    });

    return new ShaderGadgetRenderer(
      new ShaderGadgetProgram({
        root,
        context,
        presentationFormat,
        sourceFactory: createSourceCanvas,
      }),
    );
  }

  resize(width: number, height: number) {
    this.program.resize(width, height);
  }

  render(state: ShaderGadgetState) {
    this.program.render(state);
  }

  destroy() {
    this.program.destroy();
  }
}
