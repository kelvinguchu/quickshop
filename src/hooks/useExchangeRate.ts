import { useState, useEffect } from 'react';

interface ExchangeRateData {
  USD_TO_KES: number;
  lastUpdated: string;
  cached?: boolean;
  cacheAge?: number;
  fallback?: boolean;
  error?: string;
}

interface UseExchangeRateReturn {
  exchangeRate: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  isCached: boolean;
  cacheAge: number;
}

export function useExchangeRate(): UseExchangeRateReturn {
  const [data, setData] = useState<ExchangeRateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExchangeRate() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/exchange-rate');
        const result = await response.json();

        if (result.success) {
          setData(result);
        } else {
          setError(result.error || 'Failed to fetch exchange rate');
          // Use fallback data if available
          if (result.USD_TO_KES) {
            setData(result);
          }
        }
      } catch (err) {
        console.error('Error fetching exchange rate:', err);
        setError('Network error while fetching exchange rate');
        // Set fallback rate
        setData({
          USD_TO_KES: 128,
          lastUpdated: new Date().toISOString(),
          fallback: true,
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchExchangeRate();
  }, []);

  return {
    exchangeRate: data?.USD_TO_KES || 128, // Fallback to 128 if no data
    isLoading,
    error,
    lastUpdated: data?.lastUpdated || null,
    isCached: data?.cached || false,
    cacheAge: data?.cacheAge || 0,
  };
} 