import React from "react";
import "./RadioGroup.css";

const RadioGroup = ({ options, selectedOption, onOptionChange }) => {
  const handleChange = (event) => {
    onOptionChange(event.target.value);
  };

  return (
    <div className="radio-group">
      {options.map((option) => (
        <label key={option}>
          <input
            className="radio-input"
            type="radio"
            value={option}
            checked={selectedOption === option}
            onChange={handleChange}
          />
          {option}
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
