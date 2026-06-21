import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || 'USD');
  const [rates, setRates] = useState({ USD: 1, EUR: 0.92, GBP: 0.79, ZAR: 18.5 });

  useEffect(() => {
    const loadRates = async () => {
      try {
        const response = await api.get('/currency/rates');
        setRates(response.data.rates);
      } catch (error) {
        console.error('Failed to load currency rates:', error);
      }
    };
    loadRates();
  }, []);

  const convertPrice = (price) => {
    return (price * rates[currency]).toFixed(2);
  };

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, rates, convertPrice, changeCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
