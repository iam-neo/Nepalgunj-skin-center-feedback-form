import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import StarRating from './StarRating';
import PillGroup from './PillGroup';

// ⚠️ Google Apps Script Web App URL — do not change
const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxm3GwUimL6M2rfpNh8wz0B2HYKoyY_2xDNWP672P7s84vEsc8RBPt-9Fu51l7lirhTuw/exec';

const STAFF_OPTIONS = [
  'Dr. Abhishek Arjel',
  'Dr. Sapana Sharma',
  'Dr. Ansu Sharma',
  'Anjali Chaudhary',
  'Suju Thapa',
  'Abhilasha Basnet',
  'Sangita Rokaya',
];

const TREATMENT_OPTIONS = [
  'Consultation',
  'PRP/Vampire Facial',
  'Chemical Peel',
  'Carbon Laser Peel',
  'Facial',
  'Acne Treatment',
  'Skin Whitening',
  'GFC Therapy',
  'Botox',
  'Mole Removal',
  'Wart Removal',
  'Birthmark Removal',
  'Skin Tag Removal',
  'Hair Transplant',
  'Laser Tattoo Removal',
  'Scar Reduction',
  'Hydrafacial',
  'Frakels',
  'Allergy Treatment',
  'HIFU',
];

const INITIAL_STATE = {
  name: '',
  address: '',
  ageSex: '',
  contact: '',
  treatment: [],
  treatedBy: [],
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

/** Multi-select dropdown for staff/treatment selection — uses a portal so the menu
 *  is rendered in document.body and is never clipped by any parent. */
function MultiSelectDropdown({ value, onChange, options, placeholder = 'Select option(s)', getNewValue }) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  // Position the portal menu under the trigger button
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuStyle({
      position: 'fixed',
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });
  };

  // Open → measure; also reposition on scroll/resize
  useEffect(() => {
    if (open) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (name) => {
    if (getNewValue) {
      onChange(getNewValue(value, name));
    } else {
      onChange(
        value.includes(name)
          ? value.filter((v) => v !== name)
          : [...value, name]
      );
    }
  };

  const label =
    value.length === 0
      ? placeholder
      : value.length === 1
        ? value[0]
        : `${value.length} selected`;

  const menu = (
    <ul
      ref={menuRef}
      className="multi-select__menu"
      style={menuStyle}
      role="listbox"
      aria-multiselectable="true"
    >
      {options.map((name) => {
        const selected = value.includes(name);
        return (
          <li
            key={name}
            role="option"
            aria-selected={selected}
            className={`multi-select__option${selected ? ' selected' : ''}`}
            onMouseDown={(e) => { e.preventDefault(); toggle(name); }}
          >
            <span className="multi-select__checkbox">
              {selected && (
                <svg viewBox="0 0 12 10" fill="none">
                  <polyline points="1 5 4.5 8.5 11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            {name}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="multi-select">
      <button
        ref={triggerRef}
        type="button"
        id="field-treatedBy"
        className={`multi-select__trigger${open ? ' open' : ''}${value.length > 0 ? ' has-value' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="multi-select__label">{label}</span>
        <svg className="multi-select__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && createPortal(menu, document.body)}

      {/* Selected tags */}
      {value.length > 0 && (
        <div className="multi-select__tags">
          {value.map((v) => (
            <span key={v} className="multi-select__tag">
              {v}
              <button
                type="button"
                className="multi-select__tag-remove"
                onClick={() => toggle(v)}
                aria-label={`Remove ${v}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}


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
      treatment: form.treatment.join(', '),
      treatedBy: form.treatedBy.join(', '),
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

          <div className="field field-animate" style={stagger(3)}>
            <label>Treatment done</label>
            <MultiSelectDropdown
              options={TREATMENT_OPTIONS}
              placeholder="Select treatment(s)"
              value={form.treatment}
              onChange={(val) => set('treatment', val)}
              getNewValue={(current, name) => {
                // Deselect
                if (current.includes(name)) return current.filter(v => v !== name);
                // Selecting Consultation: add it alongside any existing single treatment
                if (name === 'Consultation') return ['Consultation', ...current.filter(v => v !== 'Consultation')];
                // Selecting a non-Consultation treatment while Consultation is active:
                // keep Consultation, replace any other non-Consultation selection
                if (current.includes('Consultation')) return ['Consultation', name];
                // No Consultation: single-select — replace whatever is selected
                return [name];
              }}
            />
          </div>

          <div className="field field-animate" style={stagger(3.5)}>
            <label>Treatment done by</label>
            <MultiSelectDropdown
              options={STAFF_OPTIONS}
              placeholder="Select staff member(s)"
              value={form.treatedBy}
              onChange={(val) => set('treatedBy', val)}
            />
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

          {/* ── Suggestions textarea ──
          <div className="field field-animate" style={stagger(12)}>
            <label>6. Suggestions</label>
            <textarea
              id="field-suggestion"
              placeholder="Anything we could do better?"
              value={form.suggestion}
              onChange={(e) => set('suggestion', e.target.value)}
            />
          </div> */}

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
