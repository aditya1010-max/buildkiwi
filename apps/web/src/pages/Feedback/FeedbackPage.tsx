import "./FeedbackPage.css";

import FeedbackForm from "../../components/feedback/FeedbackForm";

export default function FeedbackPage() {
  return (
    <main className="feedback-page">
      <div className="feedback-page_container">
        <header className="feedback-page_header">
          <h1>Send Feedback</h1>

          <p>
            Have an idea, found a bug, or want to share your thoughts? We'd love
            to hear from you. Your feedback helps us improve BuildKiwi for
            everyone.
          </p>
        </header>

        <FeedbackForm />
      </div>
    </main>
  );
}
