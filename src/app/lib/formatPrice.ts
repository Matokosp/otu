export function formatPrice(price: string): string {
  const [amount, currency] = price.split(' ');
  const formatted = new Intl.NumberFormat('sv-SE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(amount));

  return `${formatted} ${currency}`;
}