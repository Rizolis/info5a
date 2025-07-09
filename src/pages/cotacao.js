import { useState, useEffect } from 'react';
import useSWR from 'swr';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetcher } from '../lib/fetcher';


export default function Cotacao() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (startDate && endDate) {
      const format = (d) => d.toISOString().split('T')[0].replace(/-/g, '');
      const inicio = format(startDate);
      const fim = format(endDate);
      setUrl(`https://economia.awesomeapi.com.br/json/daily/USD-BRL/365?start_date=${inicio}&end_date=${fim}`);
    }
  }, [startDate, endDate]);

  const { data, error, isLoading } = useSWR(url, fetcher);

  return (
    <div className="container">
      <h2>Cotação EUA/BRL</h2>

      <div className="date-inputs">
        <div className="date-field">
          <label>Início:</label>
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            dateFormat="dd/MM/yyyy"
            className="date-picker"
            placeholderText="Selecione a data inicial"
          />
        </div>

        <div className="date-field">
          <label>Fim:</label>
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            dateFormat="dd/MM/yyyy"
            className="date-picker"
            placeholderText="Selecione a data final"
          />
        </div>
      </div>

      <div className="table-container">
        {!startDate || !endDate ? (
          <p className="info">Escolha as 2 datas.</p>
        ) : isLoading ? (
          <p className="info">Carregando.</p>
        ) : error ? (
          <p className="error">Erro ao buscar dados.</p>
        ) : (
          <table className="cotacao-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Compra</th>
                <th>Venda</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.map((item) => (
                <tr key={item.timestamp}>
                  <td>{new Date(item.timestamp * 1000).toLocaleDateString()}</td>
                  <td>R$ {parseFloat(item.bid).toFixed(2).replace('.', ',')}</td>
                  <td>R$ {parseFloat(item.ask).toFixed(2).replace('.', ',')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
