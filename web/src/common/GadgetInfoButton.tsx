import { useEffect, useRef, useState, type ReactNode } from "react";
import type { GadgetInfo } from "../../../shared-ts/gadgets";

type GadgetInfoButtonProps = {
  info: GadgetInfo;
};

export function GadgetInfoButton({ info }: GadgetInfoButtonProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <>
      <button
        aria-label="Gadget information"
        className="gadget-info-trigger"
        onClick={() => setOpen(true)}
        type="button"
      >
        i
      </button>

      <dialog
        aria-labelledby="gadget-info-title"
        className="gadget-info-dialog"
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        ref={dialogRef}
      >
        <div className="gadget-info-header">
          <h2 id="gadget-info-title">Info</h2>
          <button
            aria-label="Close gadget information"
            className="gadget-info-close"
            onClick={() => setOpen(false)}
            type="button"
          >
            X
          </button>
        </div>

        <InfoSection title="Sources">
          <div className="gadget-info-source-list">
            {info.sources.map((source) => (
              <a
                className="gadget-info-source"
                href={source.url}
                key={source.url}
                rel="noreferrer"
                target="_blank"
              >
                <span className="gadget-info-source-label">{source.label}</span>
                <span className="gadget-info-source-url">{source.url}</span>
              </a>
            ))}
          </div>
        </InfoSection>

        <InfoSection title="Available">
          <p className="gadget-info-available">{info.availableIn.join(", ")}</p>
        </InfoSection>
      </dialog>
    </>
  );
}

type InfoSectionProps = {
  children: ReactNode;
  title: string;
};

function InfoSection({ children, title }: InfoSectionProps) {
  return (
    <section className="gadget-info-section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}
