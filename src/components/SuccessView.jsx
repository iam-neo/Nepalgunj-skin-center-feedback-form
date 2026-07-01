export default function SuccessView() {
  return (
    <div className="success-view">
      <div className="check-container">
        {/* Expanding ring animations */}
        <div className="check-ring" />
        <div className="check-ring" />

        {/* Confetti dots */}
        <span className="confetti-dot" />
        <span className="confetti-dot" />
        <span className="confetti-dot" />
        <span className="confetti-dot" />
        <span className="confetti-dot" />
        <span className="confetti-dot" />

        <div className="check">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--maroon)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>
      <h2>Thank you!</h2>
      <p>Your feedback has been received.<br />We appreciate you taking the time.</p>
    </div>
  );
}
