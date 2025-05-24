import React, { useState } from 'react';
import './App.css';
import CreateToolPopup from './components/CreateTool/create_tool_popup';
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import ToolsTablePage from './components/ToolsTablePage';


function MainPage({ 
  modal, toggleModal, instrumentName, setInstrumentName, instrumentType, setInstrumentType, 
  socket, setSocketType, power, setPower, voltage, setVoltage, handleSubmit 
}) {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="flex-container">
        <div 
          className="mainAddBorder"
          onClick={toggleModal}
        >
          Создать инструмент
        </div>

        <CreateToolPopup
          isOpen={modal}
          onClose={toggleModal}
          instrumentName={instrumentName}
          setInstrumentName={setInstrumentName}
          instrumentType={instrumentType}
          setInstrumentType={setInstrumentType}
          handleSubmit={handleSubmit}
          socket={socket}
          setSocketType={setSocketType}
          power={power}
          setPower={setPower}
          voltage={voltage}
          setVoltage={setVoltage}
        />

        <div 
          className="mainAddBorder"
          onClick={() => navigate("/tools")}
        >
          Мои инструменты
        </div>
      </div>
    </div>
  );
}



function App() {
  const [modal, setModal] = useState(false);
  const [instrumentName, setInstrumentName] = useState('');
  const [instrumentType, setInstrumentType] = useState('');
  const [socket, setSocketType] = useState('');
  const [power, setPower] = useState('');
  const [voltage, setVoltage] = useState(220);

  const toggleModal = () => {
    setModal(!modal);
    if (modal) {
      setInstrumentName('');
      setInstrumentType('');
      setSocketType('');
      setPower('');
      setVoltage(220);
    }
  };

  const handleSubmit = () => {
    const toolData = {
      name: instrumentName,
      type: instrumentType,
      ...(instrumentType === "ElectricTool" && { socket, power, voltage }),
      ...(instrumentType === "AccumulatorHandTool" && { charge: 100 })
    };

    axios.post("http://localhost:8000/tools/", toolData)
      .then(response => {
        console.log(response.data);
      });
    toggleModal();
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <MainPage
            modal={modal}
            toggleModal={toggleModal}
            instrumentName={instrumentName}
            setInstrumentName={setInstrumentName}
            instrumentType={instrumentType}
            setInstrumentType={setInstrumentType}
            socket={socket}
            setSocketType={setSocketType}
            power={power}
            setPower={setPower}
            voltage={voltage}
            setVoltage={setVoltage}
            handleSubmit={handleSubmit}
          />
        } />
        <Route path="/tools" element={<ToolsTablePage />} />
      </Routes>
    </Router>
  );
}

export default App;