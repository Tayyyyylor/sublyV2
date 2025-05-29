export interface CategoryStat {
  categoryId: string;
  name: string;
  icon: string;
  total: number;
  percent: number;
}

function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (acc, item) => {
      const k = String(item[key]);
      if (!acc[k]) acc[k] = [];
      acc[k].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}
