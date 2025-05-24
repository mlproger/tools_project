import React from 'react';

const CreateToolPopup = ({
  isOpen,
  onClose,
  instrumentName,
  setInstrumentName,
  instrumentType,
  setInstrumentType,
  handleSubmit,
  socket,
  setSocketType,
  power,
  setPower,
  voltage,
  setVoltage
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="overlay" onClick={onClose}></div>
      <div className="modal-content">
        <h2>Создание нового инструмента</h2>
        
        <div className="form-group">
          <label htmlFor="instrument-name">Название инструмента</label>
          <input
            id="instrument-name"
            type="text"
            value={instrumentName}
            onChange={(e) => setInstrumentName(e.target.value)}
            placeholder="Введите название"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="instrument-type">Тип инструмента</label>
          <select
            id="instrument-type"
            value={instrumentType}
            onChange={(e) => setInstrumentType(e.target.value)}
            className="form-select"
          >
            <option value="">Выберите тип</option>
            <option value="HandTool">Ручной инструмент</option>
            <option value="ElectricTool">Электрический инструмент</option>
            <option value="AccumulatorTool">Ручной инструмент с повербанком</option>
          </select>
        </div>

        {instrumentType === "ElectricTool" && (
          <>
            <div className="form-group">
              <label htmlFor="socket-type">Тип розетки</label>
              <select
                id="socket-type"
                value={socket}
                onChange={(e) => setSocketType(e.target.value)}
                className="form-select"
              >
                <option value="">Выберите тип розетки</option>
                <option value="Euro">Европейская</option>
                <option value="US">Американская</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="power">Мощность (Вт)</label>
              <input
                id="power"
                type="number"
                value={power}
                onChange={(e) => setPower(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="voltage">Вольтаж</label>
              <input
                id="voltage"
                type="number"
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                className="form-input"
              />
            </div>
          </>
        )}

        <div className="modal-buttons">
          <button className="modal-button cancel" onClick={onClose}>Отмена</button>
          <button 
            className="modal-button submit"
            onClick={handleSubmit}
            disabled={!instrumentName || !instrumentType || (instrumentType === "ElectricTool" && (!socket || !power || !voltage))}
          >
            Создать
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateToolPopup;
