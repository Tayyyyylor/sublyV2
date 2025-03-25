// store/transactionStore.ts
import { create } from 'zustand';

interface Transaction {
  id: string;
  name: string;
  startDate: Date; // format 'DD-MM-YYYY' default date du jour ou jour selected
  amount: number;
  category: string; // default streaming + faire liste de catégories
  frequency: string; // default mensuel + faire liste des options dispo
  endDate?: Date;
  logo?: string; // via api logo ( logo.dev )
}

interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  setTransactions: (txs: Transaction[]) => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  addTransaction: (tx) =>
    set((state) => ({
      transactions: [...state.transactions, tx],
    })),
  setTransactions: (txs) => set({ transactions: txs }),
}));
