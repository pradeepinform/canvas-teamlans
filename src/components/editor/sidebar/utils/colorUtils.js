export const hexToRgba = (hex, alpha = 1) => {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const adjustBrightness = (hex, amount) => {
  let col = parseInt(hex.replace("#", ""), 16);
  let r = Math.min(255, Math.max(0, ((col >> 16) & 0xff) + amount));
  let g = Math.min(255, Math.max(0, ((col >> 8) & 0xff) + amount));
  let b = Math.min(255, Math.max(0, (col & 0xff) + amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};
