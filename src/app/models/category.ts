import { EnumValue } from './enum-value.model';

export type CategoryType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: string;
  categoryName: string;
  parentId: string | null;
  categoryType: EnumValue;
  children: Category[];
  hasChildren: boolean;
  isSystem: boolean;
  createdDate: string;
  createdBy: string;
}

export interface CategoryRequest {
  categoryName: string;
  parentId?: string;
  categoryType?: CategoryType;
}

export interface CategoryFilter {
  categoryName?: string;
  categoryType?: CategoryType;
}
