import React from 'react';
import InputSlider from 'react-input-slider';
import '../styles/main.css';

const GSlider = ({ label, value, min, max, step, onChange, disabled }) => {
  const handleChange = (x) => {
    onChange(x);
  };

  return (
    <div className='slider'>
      <label>{label}</label>
      <InputSlider
        axis="x"
        x={value}
        xmin={min}
        xmax={max}
        xstep={step}
        onChange={handleChange}
        disabled={disabled}
        styles={{
          track: {
            backgroundColor: 'lightgray',
            height: '6px',
            borderRadius: '3px',
            width: '100%',
          },
          active: {
            backgroundColor: 'green',
          },
          thumb: {
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: 'white',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
          },
        }}
      />
    </div>
  );
};

export default GSlider;
