export type NativeGadgetSliderProps = {
  accessibilityLabel: string;
  max: number;
  min: number;
  onValueChange: (value: number) => void;
  step: number;
  value: number;
};
