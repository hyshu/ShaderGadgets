import type { ReactNode } from "react";

type ValueHeaderProps = {
  label: string;
  value: string;
};

function ValueHeader({ label, value }: ValueHeaderProps) {
  return (
    <div className="gadget-control-value">
      <span>{label}</span>
      <span className="gadget-control-number">{value}</span>
    </div>
  );
}

type GadgetSliderProps = {
  label: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number) => void;
};

function GadgetSlider({
  displayValue,
  label,
  max,
  min,
  onValueChange,
  step,
  value,
}: GadgetSliderProps) {
  return (
    <label className="gadget-slider">
      <ValueHeader label={label} value={displayValue} />
      <input
        aria-label={label}
        max={max}
        min={min}
        onChange={(event) => onValueChange(event.currentTarget.valueAsNumber)}
        step={step}
        type="range"
        value={value}
      />
    </label>
  );
}

type GadgetControlPanelProps = {
  children: ReactNode;
  framed?: boolean;
};

function GadgetControlPanel({
  children,
  framed = false,
}: GadgetControlPanelProps) {
  return (
    <div
      className={
        framed ? "gadget-control-panel is-framed" : "gadget-control-panel"
      }
    >
      {children}
    </div>
  );
}

type PlaybackControlsProps = {
  isPlaying: boolean;
  onPlay: () => void;
  onReset?: () => void;
  playDisabled?: boolean;
};

function PlaybackControls({
  isPlaying,
  onPlay,
  onReset,
  playDisabled = false,
}: PlaybackControlsProps) {
  return (
    <div className="gadget-playback">
      <button
        className="gadget-play-button"
        disabled={playDisabled}
        onClick={onPlay}
        type="button"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      {onReset ? (
        <button className="gadget-reset-button" onClick={onReset} type="button">
          Reset
        </button>
      ) : null}
    </div>
  );
}

type GadgetControlsProps = {
  framed?: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onReset: () => void;
  onTimeChange: (time: number) => void;
  time: number;
};

export function GadgetControls({
  framed = false,
  isPlaying,
  onPlay,
  onReset,
  onTimeChange,
  time,
}: GadgetControlsProps) {
  return (
    <GadgetControlPanel framed={framed}>
      <GadgetSlider
        displayValue={time.toFixed(3)}
        label="time"
        max={1}
        min={0}
        onValueChange={onTimeChange}
        step={0.001}
        value={time}
      />

      <PlaybackControls
        isPlaying={isPlaying}
        onPlay={onPlay}
        onReset={onReset}
      />
    </GadgetControlPanel>
  );
}
