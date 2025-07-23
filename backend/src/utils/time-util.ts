

export function isGreaterThan(date1: Date, date2: Date): boolean {
  return date1 > date2;
}

export function hoursPassedSince(date: Date): number {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    return diffMs / (1000 * 60 * 60);
}
