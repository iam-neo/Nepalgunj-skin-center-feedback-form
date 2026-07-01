import { useState } from 'react';

const CAPTIONS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very good',
  5: 'Excellent',
};

const STAR_POINTS =
  '12 2 15.09 8.63 22 9.24 16.5 13.97 18.18 20.9 12 17.27 5.82 20.9 7.5 13.97 2 9.24 8.91 8.63 12 2';

export default function StarRating({ value, onChange }) {
  const [hoverValue, setHoverValue] = useState(0);

  const displayValue = hoverValue || value;

  return (
    <div className="field">
      <label>
        Rate us <span className="required-mark">*</span>
      </label>

      {/* SVG gradient definition — shared by all stars */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--gold-light)" />
            <stop offset="50%" stopColor="var(--gold)" />
            <stop offset="100%" stopColor="var(--gold-deep)" />
          </linearGradient>
        </defs>
      </svg>

      <div
        className="stars"
        onMouseLeave={() => setHoverValue(0)}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className={`star${displayValue >= i ? ' filled' : ''}`}
            onClick={() => onChange(i)}
            onMouseEnter={() => setHoverValue(i)}
          >
            <polygon points={STAR_POINTS} />
          </svg>
        ))}
      </div>
      <div className="rate-caption">
        {displayValue ? `${CAPTIONS[displayValue]} (${displayValue}/5)` : ''}
      </div>
    </div>
  );
}
