import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TOOL_TYPES = [
  { value: "HandTool", label: "Ручные" },
  { value: "ElectricTool", label: "Электро" },
  { value: "AccumulatorTool", label: "Аккумуляторные" }
];

const ToolsTablePage = () => {
  const [tools, setTools] = useState([]);
  const [charges, setCharges] = useState({});
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const navigate = useNavigate();

  const isAccumulator = (type) => type === "AccumulatorTool";

  useEffect(() => {
    if (!selectedType) return;
    axios.get(`http://localhost:8000/tools/${selectedType}`)
      .then(async response => {
        setTools(response.data);
        // Для аккумуляторных инструментов получаем заряд
        if (selectedType === "AccumulatorTool") {
          const chargesObj = {};
          await Promise.all(response.data.map(async (tool) => {
            try {
              const res = await axios.get(`http://localhost:8000/tools/charge/${tool.id}`);
              chargesObj[tool.id] = res.data.charge;
            } catch {
              chargesObj[tool.id] = "—";
            }
          }));
          setCharges(chargesObj);
        } else {
          setCharges({});
        }
      })
      .catch(() => setTools([]));
  }, [selectedType]);

  const handleUse = (tool) => {
    axios.get(`http://localhost:8000/tools/use/${tool.type}/${tool.id}`)
      .then(response => {
        setPopupMessage(response.data.message || response.data);
        setPopupOpen(true);
        if (isAccumulator(tool.type)) {
          axios.get(`http://localhost:8000/tools/charge/${tool.id}`)
            .then(res => setCharges(prev => ({ ...prev, [tool.id]: res.data.charge })));
        }
      })
      .catch(() => {
        setPopupMessage("Ошибка при использовании инструмента");
        setPopupOpen(true);
      });
  };

  const handleCharge = (tool) => {
    axios.post(`http://localhost:8000/tools/charge/${tool.id}`)
      .then(response => {
        setPopupMessage(response.data.message || response.data);
        setPopupOpen(true);
        axios.get(`http://localhost:8000/tools/charge/${tool.id}`)
          .then(res => setCharges(prev => ({ ...prev, [tool.id]: res.data.charge })));
      })
      .catch(() => {
        setPopupMessage("Ошибка при зарядке инструмента");
        setPopupOpen(true);
      });
  };

  return (
    <div className="container" style={{ minHeight: "90vh", position: "relative" }}>
      <div style={{
        position: "absolute",
        top: 24,
        left: 24,
        zIndex: 10
      }}>
        <button
          onClick={() => {
            if (selectedType) {
              setSelectedType(null); // Назад к выбору типа
            } else {
              navigate("/"); // На главную, если тип не выбран
            }
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#61dafb",
            fontSize: "2.5rem"
          }}
          aria-label="Назад"
        >
          <FaArrowLeft />
        </button>
      </div>
      {!selectedType ? (
        <div style={{ marginTop: 80, textAlign: "center" }}>
          <h2>Выберите тип инструмента:</h2>
          {TOOL_TYPES.map(type => (
            <button
              key={type.value}
              style={{
                margin: "8px",
                padding: "12px 24px",
                fontSize: "1.1rem",
                cursor: "pointer"
              }}
              onClick={() => setSelectedType(type.value)}
            >
              {type.label}
            </button>
          ))}
        </div>
      ) : (
        <>
          {popupOpen && (
            <div style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000
            }}>
              <div style={{
                background: "#fff",
                padding: "24px 32px",
                borderRadius: "8px",
                boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
                minWidth: "240px",
                textAlign: "center"
              }}>
                <div style={{ marginBottom: "16px" }}>{popupMessage}</div>
                <button onClick={() => setPopupOpen(false)}>OK</button>
              </div>
            </div>
          )}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Имя</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Тип</th>
                {selectedType === "AccumulatorTool" && (
                  <th style={{ border: "1px solid #ccc", padding: "8px" }}>Заряд</th>
                )}
                {selectedType === "ElectricTool" && (
                  <>
                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>Мощность</th>
                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>Розетка</th>
                  </>
                )}
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Действие</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool, idx) => (
                <tr key={tool.id || idx}>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{tool.name}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{tool.type}</td>
                  {selectedType === "AccumulatorTool" && (
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                      {charges[tool.id]}
                    </td>
                  )}
                  {selectedType === "ElectricTool" && (
                    <>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>{tool.power}</td>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>{tool.socket}</td>
                    </>
                  )}
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {selectedType === "HandTool" && (
                      <button onClick={() => handleUse(tool)}>Использовать (ручной)</button>
                    )}
                    {selectedType === "ElectricTool" && (
                      <button onClick={() => handleUse(tool)}>Использовать (электро)</button>
                    )}
                    {selectedType === "AccumulatorTool" && (
                      <>
                        <button onClick={() => handleUse(tool)}>Использовать (аккум.)</button>
                        <button
                          style={{ marginLeft: "8px" }}
                          onClick={() => handleCharge(tool)}
                        >
                          Зарядить
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ToolsTablePage;