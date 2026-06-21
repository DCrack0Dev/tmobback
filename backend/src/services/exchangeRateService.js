import dotenv from 'dotenv';

dotenv.config();

let cachedRates = {
  usdtToUsd: 1.0,
  lastUpdated: null,
  currencyRates: {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    ZAR: 18.5
  }
};

export const getCachedRates = () => cachedRates;

export const updateUsdtRate = async () => {
  try {
    const apiUrl = process.env.EXCHANGE_RATE_API_URL || 'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd';
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.tether?.usd) {
      cachedRates.usdtToUsd = data.tether.usd;
      cachedRates.lastUpdated = new Date();
      console.log('Updated USDT rate:', cachedRates.usdtToUsd);
    }
  } catch (error) {
    console.error('Failed to update USDT rate:', error);
  }
};

export const updateCurrencyRates = async () => {
  try {
    const apiUrl = process.env.CURRENCY_RATE_API_URL || 'https://api.exchangerate-api.com/v4/latest/USD';
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.rates) {
      cachedRates.currencyRates = {
        USD: 1,
        EUR: data.rates.EUR,
        GBP: data.rates.GBP,
        ZAR: data.rates.ZAR
      };
      console.log('Updated currency rates');
    }
  } catch (error) {
    console.error('Failed to update currency rates:', error);
  }
};

export const convertUsdToDisplayCurrency = (amount, currency) => {
  const rate = cachedRates.currencyRates[currency] || 1;
  return amount * rate;
};
