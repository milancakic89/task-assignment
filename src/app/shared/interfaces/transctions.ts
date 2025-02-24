export interface Transaction {
  id: string;
  userId: string;
  purchasedItem: string;
  category: string;
  timeAndDate: Date;
  amountSpent: number;
}

export interface TransactionChange {
  transaction: Transaction;
  previousAmount: number;
}
