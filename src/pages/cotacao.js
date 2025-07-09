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
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Cotação USD/BRL</h2>

      <div>
        <label>Início: </label>
        <DatePicker selected={startDate} onChange={setStartDate} dateFormat="dd/MM/yyyy" />
      </div>

      <div>
        <label>Fim: </label>
        <DatePicker selected={endDate} onChange={setEndDate} dateFormat="dd/MM/yyyy" />
      </div>

      <div style={{ marginTop: '20px' }}>
        {!startDate || !endDate ? (
          <p>Escolha as duas datas.</p>
        ) : isLoading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p>Erro ao buscar dados.</p>
        ) : (
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Data</th>
                <th>Compra</th>
                <th>Venda</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
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
