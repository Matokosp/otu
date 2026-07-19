export function formatPrice(price: string): string {
  const [amount, currency] = price.split(' ');
  const value = parseFloat(amount);
  const hasFraction = Math.round(value * 100) % 100 !== 0;

  const formatted = new Intl.NumberFormat('sv-SE', {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);

  return `${formatted} ${currency}`;
}