export interface PayOSEnvelope<TData> {
  code: string;
  desc: string;
  data: TData;
  signature: string;
}

export interface PayOSCreatedData {
  bin: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  orderCode: number;
  currency: string;
  paymentLinkId: string;
  status: string;
  checkoutUrl: string;
  qrCode: string;
}

export interface PayOSDetailData {
  id: string;
  orderCode: number;
  amount: number;
  amountPaid: number;
  amountRemaining: number;
  status: string;
  createdAt: string;
  transactions: Record<string, unknown>[];
}

export interface PayOSUserTransaction {
  orderCode: number;
  paymentLinkId: string;
  amount: number;
  currency: string;
  description: string;
  status: string;
  type: string;
  createdDate: string;
  paidAt: string | null;
}
