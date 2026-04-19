export type InsightLevel = 'WARN' | 'DANGER' | 'SUCCESS';

export interface DashboardOverview {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface DashboardInsight {
  level: InsightLevel;
  code: string;
  value: number;
  unit: string;
  defaultColor: string;
  colorTone: string;
}

export interface WalletSummaryItem {
  walletName: string;
  balance: number;
}

export interface DashboardWalletSummary {
  walletCount: number;
  wallets: WalletSummaryItem[];
}

export interface DashboardPeriodSummary {
  from: string;
  to: string;
  income: number;
  expense: number;
}

export interface DashboardGrowthRate {
  income: number;
  expense: number;
  unit: string;
}

export interface DashboardPeriodComparison {
  current: DashboardPeriodSummary;
  previous: DashboardPeriodSummary;
  growthRate: DashboardGrowthRate;
}

export interface DashboardSummary {
  dashboardOverview: DashboardOverview;
  insight: DashboardInsight[];
  walletSummary: DashboardWalletSummary;
  period: DashboardPeriodComparison;
}
