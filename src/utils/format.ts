export const formatMoney = (value: number) => {
  const abs = Math.abs(value);

  if (abs >= 1000000000) return `${(value / 1000000000).toFixed(2)}Md`;
  if (abs >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
  if (abs >= 1000) return `${Math.round(value).toLocaleString('fr-FR')}`;

  return Math.round(value).toLocaleString('fr-FR');
};

export const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;

  return `${hours}h ${minutes}m ${rest}s`;
};
