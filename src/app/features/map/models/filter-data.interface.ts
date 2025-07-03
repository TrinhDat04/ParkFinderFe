export interface FilterData {
  categories: Array<{ name: string; selected: boolean }>;
  prices: Array<{ name: string; selected: boolean }>;
  features: Array<{ name: string; selected: boolean }>;
  scales: Array<{ name: string; selected: boolean }>;
  ratings: Array<{ name: string; selected: boolean }>;
} 