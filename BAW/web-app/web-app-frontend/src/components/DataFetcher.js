import React, { useEffect } from 'react';
import axios from 'axios';

const DataFetcher = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/');
        console.log(response.data);
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Dane pobrane z backendu</h2>
    </div>
  );
};

export default DataFetcher;
