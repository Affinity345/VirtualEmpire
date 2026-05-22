export const formatMoney = (value: number) => {
  const abs = Math.abs(value);

  if (abs >= 1000000000000000) return `${compact(value / 1000000000000000)}Qa`;
  if (abs >= 1000000000000) return `${compact(value / 1000000000000)}T`;
  if (abs >= 1000000000) return `${compact(value / 1000000000)}B`;
  if (abs >= 1000000) return `${compact(value / 1000000)}M`;
  if (abs >= 1000) return `${compact(value / 1000)}K`;

  return Math.round(value).toLocaleString('fr-FR');
};

const compact = (value: number) => {
  const abs = Math.abs(value);
  if (abs >= 100) return value.toFixed(0);
  if (abs >= 10) return value.toFixed(1);
  return value.toFixed(2);
};

export const formatDuration = (seconds: number) => {
  const wholeSeconds = Math.floor(seconds);
  const hours = Math.floor(wholeSeconds / 3600);
  const minutes = Math.floor((wholeSeconds % 3600) / 60);
  const rest = wholeSeconds % 60;

  return `${hours}h ${minutes}m ${rest}s`;
};
