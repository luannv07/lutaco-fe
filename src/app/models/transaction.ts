import { EnumValue } from './enum-value.model';

export interface Transaction {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryType: EnumValue;
  amount: number;
  transactionDate: string;
  note: string;
  createdDate: string;
  walletId: string;
  walletName: string;
}

export interface TransactionFilter {
  categoryName?: string;
  walletName?: string;
  fromDate?: string;
  toDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface TransactionCreateRequest {
  categoryId: string;
  walletId: string;
  amount: number;
  transactionDate: string;
  note?: string;
}
