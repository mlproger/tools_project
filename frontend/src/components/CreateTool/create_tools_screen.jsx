import React, {useState} from 'react';
import Dropdown from './dropdown';

const CreateToolScreen = () => {

  const toolsType = [
    {value: "handTool", label: "Ручной инструмент"},
    {value: "electricTool", label: "Ручной инструмент"},
    {value: "accumulatorHandTool", label: "Ручной инструмент с аккамулятором"}
  ]

  const handleSelect = (selectedValue) => {
    console.log('Выбрано:', selectedValue);
  };



  return (
    <div>
      <h1>  
        Создать иснтрумент
        <Dropdown
          options={toolsType} 
        />
      </h1>
    </div>
  );
};

export default CreateToolScreen;