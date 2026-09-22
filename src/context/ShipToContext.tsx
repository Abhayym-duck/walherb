'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export interface Country {
  code: string;
  name: string;
  flag: string;
  currencyCode: string;
  symbol: string;
  /** Fixed conversion rate FROM 1 INR to this country's currency. */
  rateFromInr: number;
}

export const COUNTRIES: Country[] = [
  { code: 'IN', name: 'India',                 flag: '🇮🇳', currencyCode: 'INR', symbol: '₹',   rateFromInr: 1 },
  { code: 'AE', name: 'United Arab Emirates',   flag: '🇦🇪', currencyCode: 'AED', symbol: 'AED', rateFromInr: 0.044 },
  { code: 'QA', name: 'Qatar',                  flag: '🇶🇦', currencyCode: 'QAR', symbol: 'QAR', rateFromInr: 0.044 },
  { code: 'SA', name: 'Saudi Arabia',           flag: '🇸🇦', currencyCode: 'SAR', symbol: 'SAR', rateFromInr: 0.045 },
  { code: 'ZA', name: 'South Africa',           flag: '🇿🇦', currencyCode: 'ZAR', symbol: 'R',   rateFromInr: 0.22 },
  { code: 'MY', name: 'Malaysia',               flag: '🇲🇾', currencyCode: 'MYR', symbol: 'RM',  rateFromInr: 0.056 },
  { code: 'AU', name: 'Australia',              flag: '🇦🇺', currencyCode: 'AUD', symbol: 'AUD', rateFromInr: 0.018 },
];

const DEFAULT_COUNTRY = COUNTRIES[0];
const STORAGE_KEY = 'walherb_ship_to';

/** Pure function: format an INR value in the given country's currency. */
export function formatPrice(inrValue: number, country: Country): string {
  const converted = Math.round(inrValue * country.rateFromInr);
  const amount = converted.toLocaleString('en-US');
  return country.code === 'IN' ? `₹${amount}` : `${country.symbol} ${amount}`;
}

interface ShipToContextValue {
  country: Country;
  countries: Country[];
  setCountry: (code: string) => void;
  formatPrice: (inrValue: number) => string;
}

const ShipToContext = createContext<ShipToContextValue | null>(null);

export const useShipTo = (): ShipToContextValue => {
  const ctx = useContext(ShipToContext);
  if (!ctx) throw new Error('useShipTo must be used within ShipToProvider');
  return ctx;
};

export const ShipToProvider = ({ children }: { children: React.ReactNode }) => {
  const [country, setCountryState] = useState<Country>(DEFAULT_COUNTRY);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const found = COUNTRIES.find((c) => c.code === saved);
        if (found) setCountryState(found);
      }
    } catch {
      // localStorage unavailable — fall back to default silently.
    }
  }, []);

  const setCountry = useCallback((code: string) => {
    const found = COUNTRIES.find((c) => c.code === code);
    if (!found) return;
    setCountryState(found);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // ignore write failures (private browsing, quota, etc.)
    }
  }, []);

  const boundFormatPrice = useCallback(
    (inrValue: number) => formatPrice(inrValue, country),
    [country],
  );

  const value = useMemo<ShipToContextValue>(
    () => ({ country, countries: COUNTRIES, setCountry, formatPrice: boundFormatPrice }),
    [country, setCountry, boundFormatPrice],
  );

  return <ShipToContext.Provider value={value}>{children}</ShipToContext.Provider>;
};
