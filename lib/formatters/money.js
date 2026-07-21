export const formatMoney = (value) =>
  Number(value || 0).toLocaleString("pl-PL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }) + " zł";
