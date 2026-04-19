import { EnumValue } from './enum-value.model';

export type RecurringFrequentType = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface RecurringTransaction {
  id: number;
  transactionId: string;
  startDate: string;
  nextDate: string;
  frequentType: EnumValue;
}

export interface RecurringTransactionFilter {
  frequentType?: RecurringFrequentType;
}

export interface RecurringTransactionRequest {
  transactionId: string;
  frequentType: RecurringFrequentType;
  startDate: string;
}
