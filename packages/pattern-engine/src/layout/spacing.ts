export function distributeSpacing(
  count: number,
  start: number,
  end: number,
): number[] {
  if (count <= 0) {
    return [];
  }

  if (count === 1) {
    return [(start + end) / 2];
  }

  const step = (end - start) / (count - 1);

  return Array.from({ length: count }, (_, index) => start + step * index);
}

export function lerp(start: number, end: number, amount: number): number {
  return start + (end - start) * amount;
}
