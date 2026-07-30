import { ReactElement } from "react";
import { useParams } from "react-router-dom";

import "./EditProjectPage.css";

export default function EditProjectPage(): ReactElement {
  const { id } = useParams();

  return (
    <main className="edit-project-page">
      <div className="edit-project-page__container">
        <header className="edit-project-page__header">
          <h1>Edit Project</h1>
          <p>Update your project information.</p>
        </header>

        <section className="edit-project-page__content">
          <p>Editing project:</p>
          <code>{id}</code>

          <div className="edit-project-page__placeholder">
            Project form will go here.
          </div>
        </section>
      </div>
    </main>
  );
}
