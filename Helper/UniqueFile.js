// Helper function to get unique values from the data
export function getUniqueValues(data, field) {
  return new Set(data.map((item) => item[field]));
}
