export const formatToRupiah = (value) => {
  const numberValue = Number(value) || 0;
  const isNegative = numberValue < 0;

  const formattedValue = new Intl.NumberFormat("id-ID", {
    style: "decimal",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Math.abs(numberValue));

  return `${isNegative ? "-" : ""}Rp ${formattedValue}`;
};
