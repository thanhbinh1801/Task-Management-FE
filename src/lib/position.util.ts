export function calculateNewPosition(
  prevPosition?: number | null,
  nextPosition?: number | null
): number {
  // Xử lý cả null và undefined
  const prev = prevPosition ?? null;
  const next = nextPosition ?? null;
  
  if (prev === null && next === null) {
    return 1000;
  }
  if (prev === null) {
    return next! / 2;
  }
  if (next === null) {
    return prev + 1000;
  }
  return (prev + next) / 2;
}