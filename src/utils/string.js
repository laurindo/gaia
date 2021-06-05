export const truncate = (string, start, end, separator) => {
  const substring = string.substring(start, string.length - 1 + end);
  return string.replace(substring, separator);
};
export const capitalize = string => {
  if (typeof string !== 'string') return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};
