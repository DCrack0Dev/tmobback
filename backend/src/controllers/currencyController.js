import { getCachedRates } from '../services/exchangeRateService.js';

export const getCurrencyRates = (req, res) => {
  const rates = getCachedRates();
  res.json({
    rates: rates.currencyRates,
    last_updated: rates.lastUpdated
  });
};
