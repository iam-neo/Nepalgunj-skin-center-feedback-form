import { useState } from 'react';
import StarRating from './StarRating';
import PillGroup from './PillGroup';

// ⚠️ Google Apps Script Web App URL — do not change
const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxm3GwUimL6M2rfpNh8wz0B2HYKoyY_2xDNWP672P7s84vEsc8RBPt-9Fu51l7lirhTuw/exec';

const INITIAL_STATE = {
  name: '',
  address: '',
  ageSex: '',
  contact: '',
  treatment: '',
  treatedBy: '',
  rating: 0,
  feedbackText: '',
  satisfaction: '',
  pain: '',
  staffBehavior: '',
  cleanliness: '',
  waitingTime: '',
  suggestion: '',
};

/** Inline style for staggered entrance delay */
const stagger = (i) => ({ animationDelay: `${0.35 + i * 0.04}s` });

export default function FeedbackForm({ onSuccess }) {
  const [form, setForm] = useState(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ message: '', ok: false, show: false });

  /* ── helpers ── */
  const set = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const showStatus = (message, ok) =>
    setStatus({ message, ok, show: true });

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      showStatus('Please enter your name.', false);
      return;
    }
    if (!form.rating) {
      showStatus('Please give a star rating.', false);
      return;
    }

    setSubmitting(true);

    const data = {
      name: form.name.trim(),
      address: form.address.trim(),
      ageSex: form.ageSex.trim(),
      contact: form.contact.trim(),
      treatment: form.treatment.trim(),
      treatedBy: form.treatedBy.trim(),
      rating: form.rating,
      feedbackText: form.feedbackText.trim(),
      satisfaction: form.satisfaction,
      pain: form.pain,
      staffBehavior: form.staffBehavior,
      cleanliness: form.cleanliness,
      waitingTime: form.waitingTime,
      suggestion: form.suggestion.trim(),
      submittedAt: new Date().toISOString(),
    };

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Apps Script web apps don't return CORS headers
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(data),
      });
      // no-cors means we can't read the response — optimistic success
      onSuccess();
    } catch {
      showStatus('Something went wrong. Please try again.', false);
      setSubmitting(false);
    }
  };

  return (
    <div id="formView">
      <h1>How was your visit?</h1>
      <p className="sub">
        Your feedback helps us improve care for every patient who walks through
        our door.
      </p>

      <div className="card">
        <form id="feedbackForm" noValidate onSubmit={handleSubmit}>
          {/* ── Patient info ── */}
          <div className="field field-animate" style={stagger(0)}>
            <label>
              Name <span className="required-mark">*</span>
            </label>
            <input
              type="text"
              id="field-name"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
          </div>

          <div className="field field-animate" style={stagger(1)}>
            <label>Address</label>
            <input
              type="text"
              id="field-address"
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
            />
          </div>

          <div className="row2 field-animate" style={stagger(2)}>
            <div className="field">
              <label>Age / Sex</label>
              <input
                type="text"
                id="field-ageSex"
                placeholder="e.g. 28 / F"
                value={form.ageSex}
                onChange={(e) => set('ageSex', e.target.value)}
              />
            </div>
            <div className="field">
              <label>Contact</label>
              <input
                type="tel"
                id="field-contact"
                placeholder="98XXXXXXXX"
                value={form.contact}
                onChange={(e) => set('contact', e.target.value)}
              />
            </div>
          </div>

          <div className="row2 field-animate" style={stagger(3)}>
            <div className="field">
              <label>Treatment done</label>
              <input
                type="text"
                id="field-treatment"
                value={form.treatment}
                onChange={(e) => set('treatment', e.target.value)}
              />
            </div>
            <div className="field">
              <label>Treatment done by</label>
              <input
                type="text"
                id="field-treatedBy"
                value={form.treatedBy}
                onChange={(e) => set('treatedBy', e.target.value)}
              />
            </div>
          </div>

          <hr className="divider" />

          {/* ── Star rating ── */}
          <div className="field-animate" style={stagger(4)}>
            <StarRating
              value={form.rating}
              onChange={(val) => set('rating', val)}
            />
          </div>

          {/* ── Feedback textarea ── */}
          <div className="field field-animate" style={stagger(5)}>
            <label>Feedback / complaints</label>
            <textarea
              id="field-feedbackText"
              placeholder="Tell us anything on your mind..."
              value={form.feedbackText}
              onChange={(e) => set('feedbackText', e.target.value)}
            />
          </div>

          <hr className="divider" />
          <p className="section-title field-animate" style={stagger(6)}>A few quick questions</p>

          {/* ── Quick questions ── */}
          <div className="field-animate" style={stagger(7)}>
            <PillGroup
              label="1. Satisfaction"
              name="satisfaction"
              options={['Dissatisfied', 'Satisfied', 'Very satisfied']}
              value={form.satisfaction}
              onChange={set}
            />
          </div>

          <div className="field-animate" style={stagger(8)}>
            <PillGroup
              label="2. Pain"
              name="pain"
              options={['None', 'Mild', 'Moderate', 'Severe']}
              value={form.pain}
              onChange={set}
            />
          </div>

          <div className="field-animate" style={stagger(9)}>
            <PillGroup
              label="3. Staff behavior"
              name="staffBehavior"
              options={['Poor', 'Average', 'Good', 'Excellent']}
              value={form.staffBehavior}
              onChange={set}
            />
          </div>

          <div className="field-animate" style={stagger(10)}>
            <PillGroup
              label="4. Cleanliness"
              name="cleanliness"
              options={['Poor', 'Average', 'Good', 'Excellent']}
              value={form.cleanliness}
              onChange={set}
            />
          </div>

          <div className="field-animate" style={stagger(11)}>
            <PillGroup
              label="5. Waiting time"
              name="waitingTime"
              options={['Short', 'Moderate', 'Long']}
              value={form.waitingTime}
              onChange={set}
            />
          </div>

          {/* ── Suggestions textarea ── */}
          <div className="field field-animate" style={stagger(12)}>
            <label>6. Suggestions</label>
            <textarea
              id="field-suggestion"
              placeholder="Anything we could do better?"
              value={form.suggestion}
              onChange={(e) => set('suggestion', e.target.value)}
            />
          </div>

          <div className="field-animate" style={stagger(13)}>
            <button
              type="submit"
              className="submit"
              id="submitBtn"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit feedback'}
            </button>
          </div>

          {status.show && (
            <div className={`status show ${status.ok ? 'ok' : 'err'}`}>
              {status.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
