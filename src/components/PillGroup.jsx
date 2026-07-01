export default function PillGroup({ label, name, options, value, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="choice-group">
        {options.map((option) => (
          <span
            key={option}
            className={`pill${value === option ? ' active' : ''}`}
            onClick={() => onChange(name, option)}
          >
            {option}
          </span>
        ))}
      </div>
    </div>
  );
}
