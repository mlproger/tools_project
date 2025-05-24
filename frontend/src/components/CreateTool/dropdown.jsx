import React, { useState } from 'react';

const Dropdown = ({ options}) => {
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
  };

  return (
    <select 
      value={selectedValue} 
      onChange={handleChange}
      className="dropdown"
    >
      <option value="" disabled>Выбрать тип инструмента</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;