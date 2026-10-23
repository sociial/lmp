export const escapeXml = (value, maxLength) =>
  String(value ?? "")
    .slice(0, maxLength)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export function countUsage(generations, range) {
  const now = new Date();
  let start;

  if (range === "daily") {
    start = new Date(now.setHours(0, 0, 0, 0)).getTime();
  } else if (range === "weekly") {
    const firstDayOfWeek = new Date();
    firstDayOfWeek.setDate(now.getDate() - now.getDay());
    start = new Date(firstDayOfWeek.setHours(0, 0, 0, 0)).getTime();
  } else if (range === "monthly") {
    start = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  } else {
    throw new Error(`Invalid range: ${range}`);
  }

  return generations.filter((date) => date.getTime() >= start).length;
}
