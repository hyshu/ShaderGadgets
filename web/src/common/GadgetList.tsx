import { GADGETS } from "./gadgetCatalog";
import type { TransitionMode } from "./webgpu/shaderGadget";

type GadgetListProps = {
  mode: TransitionMode;
  onSelect: (mode: TransitionMode) => void;
};

export function GadgetList({ mode, onSelect }: GadgetListProps) {
  return (
    <nav aria-label="Shader samples">
      <div className="gadget-list">
        {GADGETS.map((gadget) => {
          const isSelected = gadget.mode === mode;

          return (
            <button
              aria-current={isSelected ? "page" : undefined}
              className={
                isSelected ? "gadget-list-item is-selected" : "gadget-list-item"
              }
              key={gadget.mode}
              onClick={() => onSelect(gadget.mode)}
              type="button"
            >
              <span>{gadget.label}</span>
              <span aria-hidden className="gadget-list-chevron" />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
