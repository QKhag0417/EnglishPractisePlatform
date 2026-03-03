export function indexByOrderIndex<T extends { orderIndex: number }>(
  list: T[] | null | undefined,
): Record<number, T> {
  const map: Record<number, T> = {};
  for (const item of list ?? []) {
    map[item.orderIndex] = item;
  }
  return map;
}
