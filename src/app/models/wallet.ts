import { EnumValue } from './enum-value.model';

export interface Wallet {
  id: string;
  walletName: string;
  initialBalance: number;
  currentBalance: number;
  description: string;
  status: EnumValue;
  userId: string;
}

export interface WalletCreateRequest {
  walletName: string;
  balance: number;
  description?: string;
}

export interface WalletUpdateRequest {
  walletName?: string;
  description?: string;
}
