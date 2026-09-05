export const formatCurrency = (amount: number = 0, currency: string = 'USD ($)'): string => {
  const symbolMap: Record<string, string> = {
    'USD ($)': '$',
    'EUR (€)': '€',
    'GBP (£)': '£',
    'INR (₹)': '₹',
  };
  const symbol = symbolMap[currency] || '$';
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};
