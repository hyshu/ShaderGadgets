import { GadgetList } from "./GadgetList";
import { RepositoryLink } from "./RepositoryLink";

export function GadgetWorkbench() {
  return (
    <main className="gadget-page">
      <div className="gadget-shell">
        <header className="gadget-mobile-header">
          <div className="gadget-heading-row">
            <div className="gadget-heading">
              <p className="gadget-kicker">Shader Gadgets</p>
              <h1 className="gadget-title">Catalog</h1>
            </div>
            <div className="gadget-header-actions">
              <RepositoryLink />
            </div>
          </div>
          <GadgetList />
        </header>

        <header className="gadget-desktop-header">
          <h1 className="gadget-desktop-title">Catalog</h1>
          <div className="gadget-header-actions">
            <RepositoryLink />
          </div>
        </header>

        <aside className="gadget-sidebar">
          <div>
            <h2 className="gadget-sidebar-title">Shader Gadgets</h2>
          </div>
          <GadgetList />
        </aside>

        <section className="gadget-preview-column">
          <div className="gadget-preview-frame gadget-empty-state">
            <p>No gadgets yet.</p>
          </div>
        </section>

        <aside className="gadget-controls-column" />
      </div>
    </main>
  );
}
