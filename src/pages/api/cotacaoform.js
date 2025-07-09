import { useState } from "react";
import axios from "axios";

export default function CotacaoForm() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dados, setDados] = useState([]);

  const buscarDados = async () => {
    if (!startDate || !endDate) return;

    const inicio = startDate.replace(/-/g, "");
    const fim = endDate.replace(/-/g, "");

    try {
      const res = await axios.get(
        `https://economia.awesomeapi.com.br/json/daily/USD-BRL/365?start_date=${inicio}&end_date=${fim}`
      );
      setDados(res.data);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Buscar Cotação USD/BRL</h1>

      <label>Data Início:</label>
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

      <br />

      <label>Data Fim:</label>
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

      <br />

      <button onClick={buscarDados}>Buscar </button>

      <ul>
        {dados.map((item) => (
          <li key={item.timestamp}>
            <strong>{new Date(item.timestamp * 1000).toLocaleDateString()}</strong> - R$ {item.bid}
          </li>
        ))}
      </ul>
    </main>
  );
}
