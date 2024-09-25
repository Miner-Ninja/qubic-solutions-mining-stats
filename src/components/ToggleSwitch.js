import React from 'react';

const ToggleSwitch = ({ id, checked, onChange, label }) => {
  return (
    <div className="form-check form-switch fade-in mb-0">
      <input
        className="form-check-input"
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <label className="form-check-label-small" htmlFor={id}>{label}</label>
    </div>
  );
};

export default ToggleSwitch;