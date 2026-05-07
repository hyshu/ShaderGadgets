import { useCallback, useEffect, useRef, useState } from "react";
import { GadgetControls } from "./GadgetControls";
import { GadgetInfoButton } from "./GadgetInfoButton";
import { INITIAL_GADGET, getGadget } from "./gadgetCatalog";
import { GadgetList } from "./GadgetList";
import { RepositoryLink } from "./RepositoryLink";
import {
  ShaderGadgetRenderer,
  type ShaderGadgetState,
  type TransitionMode,
} from "./webgpu/shaderGadget";

const INITIAL_STATE = INITIAL_GADGET.defaultState();
const PLAY_DURATION_MS = 2000;

export function GadgetWorkbench() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<ShaderGadgetRenderer | null>(null);
  const frameRef = useRef<number | null>(null);
  const playStartRef = useRef<number>(0);
  const stateRef = useRef<ShaderGadgetState>(INITIAL_STATE);
  const [state, setState] = useState<ShaderGadgetState>(INITIAL_STATE);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gadget = getGadget(state.mode);

  const render = useCallback((nextState: ShaderGadgetState) => {
    rendererRef.current?.render(nextState);
  }, []);

  useEffect(() => {
    let disposed = false;
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * scale));
      const height = Math.max(1, Math.round(rect.height * scale));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      rendererRef.current?.resize(width, height);
      rendererRef.current?.render(stateRef.current);
    };

    ShaderGadgetRenderer.create(canvas)
      .then((renderer) => {
        if (disposed) {
          renderer.destroy();
          return;
        }

        rendererRef.current = renderer;
        resize();
        render(stateRef.current);
      })
      .catch((caught: unknown) => {
        const message =
          caught instanceof Error ? caught.message : "Failed to initialize WebGPU.";
        setError(message);
      });

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      disposed = true;
      observer.disconnect();
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      rendererRef.current?.destroy();
      rendererRef.current = null;
    };
  }, [render]);

  useEffect(() => {
    stateRef.current = state;
    render(state);
  }, [render, state]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const tick = (now: number) => {
      const time = Math.min((now - playStartRef.current) / PLAY_DURATION_MS, 1);
      setState((current) => ({ ...current, time }));

      if (time < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        frameRef.current = null;
        setIsPlaying(false);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [isPlaying]);

  const selectMode = (mode: TransitionMode) => {
    setIsPlaying(false);
    setState(getGadget(mode).defaultState());
  };

  const play = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    const startTime = stateRef.current.time >= 1 ? 0 : stateRef.current.time;
    setState((current) => ({ ...current, time: startTime }));
    playStartRef.current = performance.now() - startTime * PLAY_DURATION_MS;
    setIsPlaying(true);
  };

  const reset = () => {
    setIsPlaying(false);
    setState(getGadget(stateRef.current.mode).defaultState());
  };

  return (
    <main className="gadget-page">
      <div className="gadget-shell">
        <header className="gadget-mobile-header">
          <div className="gadget-heading-row">
            <div className="gadget-heading">
              <p className="gadget-kicker">Shader Gadgets</p>
              <h1 className="gadget-title">{gadget.label}</h1>
            </div>
            <div className="gadget-header-actions">
              <RepositoryLink />
              <GadgetInfoButton info={gadget.info} />
            </div>
          </div>
          <GadgetList mode={state.mode} onSelect={selectMode} />
        </header>

        <header className="gadget-desktop-header">
          <h1 className="gadget-desktop-title">{gadget.label}</h1>
          <div className="gadget-header-actions">
            <RepositoryLink />
            <GadgetInfoButton info={gadget.info} />
          </div>
        </header>

        <aside className="gadget-sidebar">
          <div>
            <h2 className="gadget-sidebar-title">Shader Gadgets</h2>
          </div>
          <GadgetList mode={state.mode} onSelect={selectMode} />
        </aside>

        <section className="gadget-preview-column">
          <div className="gadget-preview-frame">
            <canvas
              ref={canvasRef}
              className="gadget-canvas"
              aria-label={`${gadget.label} WebGPU preview`}
            />
          </div>

          {error ? (
            <p className="gadget-error">{error}</p>
          ) : null}
        </section>

        <aside className="gadget-controls-column">
          <GadgetControls
            framed
            isPlaying={isPlaying}
            onPlay={play}
            onReset={reset}
            onTimeChange={(time) => {
              setIsPlaying(false);
              setState((current) => ({
                ...current,
                time,
              }));
            }}
            time={state.time}
          />
        </aside>
      </div>
    </main>
  );
}
