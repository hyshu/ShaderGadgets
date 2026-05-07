import { GADGETS } from "./gadgetCatalog";

export function GadgetList() {
  return (
    <nav aria-label="Shader samples">
      <div className="gadget-list">
        {GADGETS.length === 0 ? (
          <p className="gadget-list-empty">No gadgets yet.</p>
        ) : null}
        {GADGETS.map((gadget) => {
          return (
            <button
              className="gadget-list-item"
              key={gadget.mode}
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
