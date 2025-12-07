
export interface MarketItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
  checked: boolean;
  isEstimated?: boolean; // If true, the price is an AI guess, not actual
}

export interface ShoppingTrip {
  id: string;
  date: string; // ISO string
  total: number;
  items: MarketItem[];
  itemCount: number;
}

export interface BudgetState {
  limit: number;
  current: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export const CATEGORIES = [
  "Hortifruti",
  "Açougue",
  "Mercearia",
  "Bebidas",
  "Limpeza",
  "Higiene",
  "Padaria",
  "Outros"
] as const;
