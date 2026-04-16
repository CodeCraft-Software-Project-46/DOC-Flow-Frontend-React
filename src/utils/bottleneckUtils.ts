//folder for helper functions
export interface BreachStyle {
  barClass: string;
  textClass: string;
}

export function getBreachStyle(breach: number): BreachStyle {
  if (breach <= 5) {
    return { barClass: "bg-green-500", textClass: "text-green-500" };
  }
  if (breach <= 15) {
    return { barClass: "bg-amber-500", textClass: "text-amber-500" };
  }
  return { barClass: "bg-red-500", textClass: "text-red-500" };
}

export function getProgressPercentage(avg: number, maxAvg: number): string {
  const percentage = (avg / maxAvg) * 100;
  return `${percentage}%`;
}