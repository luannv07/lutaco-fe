export interface MenuItemConfig {
  label: string;
  icon: string;
  route: string;
  translationKey: string;
}

export const SIDEBAR_MENU_CONFIG: MenuItemConfig[] = [
  {
    label: 'Dashboard',
    icon: 'fa-solid fa-chart-pie',
    route: '/dashboard',
    translationKey: 'common.menu.dashboard',
  },
  {
    label: 'Profile',
    icon: 'fa-solid fa-user',
    route: '/users/me',
    translationKey: 'common.menu.profile',
  },
  {
    label: 'Wallets',
    icon: 'fa-solid fa-wallet',
    route: '/wallets',
    translationKey: 'common.menu.wallets',
  },
  {
    label: 'Transactions',
    icon: 'fa-solid fa-money-bill-transfer',
    route: '/transactions',
    translationKey: 'common.menu.transactions',
  },
];

