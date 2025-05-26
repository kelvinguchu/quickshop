import { NextRequest, NextResponse } from "next/server";

// Cache for storing exchange rate data
let exchangeRateCache: {
  data: { USD_TO_KES: number; lastUpdated: string } | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

// Cache duration: 30 minutes (1800 seconds)
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

async function fetchExchangeRate(): Promise<{
  USD_TO_KES: number;
  lastUpdated: string;
}> {
  const apiKey = process.env.EXCHANGE_RATE_API;

  if (!apiKey) {
    throw new Error("Exchange rate API key not configured");
  }

  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Exchange rate API error: ${response.status}`);
  }

  const data = await response.json();

  if (data.result !== "success") {
    throw new Error("Exchange rate API returned error result");
  }

  return {
    USD_TO_KES: data.conversion_rates.KES,
    lastUpdated: data.time_last_update_utc,
  };
}

export async function GET(request: NextRequest) {
  try {
    const now = Date.now();

    // Check if we have cached data and it's still valid (less than 30 minutes old)
    if (
      exchangeRateCache.data &&
      now - exchangeRateCache.timestamp < CACHE_DURATION
    ) {
      // Return cached data
      return NextResponse.json({
        success: true,
        ...exchangeRateCache.data,
        cached: true,
        cacheAge: Math.floor((now - exchangeRateCache.timestamp) / 1000 / 60), // Age in minutes
      });
    }

    // Cache is expired or doesn't exist, fetch new data
    const freshData = await fetchExchangeRate();

    // Update cache
    exchangeRateCache = {
      data: freshData,
      timestamp: now,
    };

    return NextResponse.json({
      success: true,
      ...freshData,
      cached: false,
      cacheAge: 0,
    });
  } catch (error) {
    console.error("Error fetching exchange rate:", error);

    // If we have cached data (even if expired), return it as fallback
    if (exchangeRateCache.data) {
      const now = Date.now();
      return NextResponse.json({
        success: true,
        ...exchangeRateCache.data,
        cached: true,
        fallback: true,
        cacheAge: Math.floor((now - exchangeRateCache.timestamp) / 1000 / 60),
        error: "Using cached data due to API error",
      });
    }

    // No cached data available, return default rate
    return NextResponse.json(
      {
        success: false,
        USD_TO_KES: 128, // Fallback rate
        lastUpdated: new Date().toISOString(),
        cached: false,
        fallback: true,
        error: "Failed to fetch exchange rate, using fallback",
      },
      { status: 500 }
    );
  }
}
