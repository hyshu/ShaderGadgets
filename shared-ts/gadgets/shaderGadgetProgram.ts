import type { ShaderGadgetProgramOptions } from "../shaderGadgetCore";
import { GlideShaderGadgetProgram } from "./glide/shaderGadget";
import type {
  ShaderGadgetSourceFactory,
  ShaderGadgetState,
  TransitionMode,
} from "./types";

type GadgetProgram = {
  resize: (width: number, height: number) => void;
  render: (state: ShaderGadgetState) => void;
  destroy: () => void;
};

type Options = ShaderGadgetProgramOptions<TransitionMode>;

export class ShaderGadgetProgram {
  private readonly options: Options;
  private height = 0;
  private program: GadgetProgram | null = null;
  private programMode: TransitionMode | null = null;
  private width = 0;

  constructor(options: Options) {
    this.options = options;
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.program?.resize(width, height);
  }

  render(state: ShaderGadgetState) {
    this.ensureProgram(state.mode);
    this.program?.render(state);
  }

  destroy() {
    this.program?.destroy();
    this.program = null;
    this.programMode = null;
    this.options.root.destroy();
  }

  private ensureProgram(mode: TransitionMode) {
    if (this.program && this.programMode === mode) {
      return;
    }

    this.program?.destroy();
    this.program = createProgram(mode, this.options);
    this.programMode = mode;

    if (this.width > 0 && this.height > 0) {
      this.program.resize(this.width, this.height);
    }
  }
}

function createProgram(mode: TransitionMode, options: Options): GadgetProgram {
  switch (mode) {
    case "glide":
      return new GlideShaderGadgetProgram({
        ...options,
        ownsRoot: false,
        sourceFactory: createModeSourceFactory(options.sourceFactory, mode),
      }) as GadgetProgram;
    default: {
      const unreachable: never = mode;
      throw new Error(`Unsupported gadget mode: ${unreachable}`);
    }
  }
}

function createModeSourceFactory<TMode extends TransitionMode>(
  sourceFactory: ShaderGadgetSourceFactory,
  mode: TMode,
) {
  return ((_: TMode, variant: 0 | 1) =>
    sourceFactory(mode, variant)) as ShaderGadgetProgramOptions<TMode>["sourceFactory"];
}
