import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'currency' | 'date' | 'badge';
  align?: 'left' | 'center' | 'right';
  width?: string;
  sortable?: boolean;
  badgeMap?: Record<string, 'income' | 'expense' | 'pending' | 'neutral'>;
}
export type TableTheme = 'light' | 'dark' | 'minimal';
export type TableVariant = 'default' | 'striped' | 'bordered';

@Component({
  selector: 'app-table',

  imports: [CommonModule, FormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css', // Changed from .scss to .css
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() theme: TableTheme = 'light';
  @Input() variant: TableVariant = 'default';
  @Input() maxHeight = '480px';
  @Input() pageSizes = [10, 20, 50, 100];
  @Input() pageSize = 10;
  @Input() loading = false;
  @Input() selectable = false;
  @Input() customClass = '';
  @Output() rowClick = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any[]>();

  page = 1;
  size = 10;
  gotoVal = '';
  sortKey = '';
  sortDir: 'asc' | 'desc' = 'asc';
  selected = new Set<number>();

  constructor(private cdr: ChangeDetectorRef) {}

  get total() {
    return this.data.length;
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.total / this.size));
  }

  get startItem() {
    return Math.min((this.page - 1) * this.size + 1, this.total);
  }

  get endItem() {
    return Math.min(this.page * this.size, this.total);
  }

  get sorted() {
    if (!this.sortKey) return [...this.data];
    return [...this.data].sort((a, b) => {
      const r = a[this.sortKey] < b[this.sortKey] ? -1 : a[this.sortKey] > b[this.sortKey] ? 1 : 0;
      return this.sortDir === 'asc' ? r : -r;
    });
  }

  get paged() {
    const s = (this.page - 1) * this.size;
    return this.sorted.slice(s, s + this.size);
  }

  get pages(): (number | '...')[] {
    const t = this.totalPages,
      c = this.page;
    if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1);
    const r: (number | '...')[] = [1];
    if (c > 3) r.push('...');
    for (let i = Math.max(2, c - 1); i <= Math.min(t - 1, c + 1); i++) r.push(i);
    if (c < t - 2) r.push('...');
    r.push(t);
    return r;
  }

  get isDark() {
    return this.theme === 'dark';
  }

  get wrapCls() {
    const t = {
      light: 'bg-white border border-slate-200 shadow-sm',
      dark: 'bg-slate-900 border border-slate-700 shadow-xl',
      minimal: 'bg-transparent border border-slate-100',
    }[this.theme];
    return `${t} rounded-xl overflow-hidden ${this.customClass}`;
  }

  get theadCls() {
    return { light: 'bg-slate-50', dark: 'bg-slate-800', minimal: 'bg-slate-50/70' }[this.theme];
  }

  get thTxtCls() {
    return {
      light: 'text-slate-500 border-b border-slate-200',
      dark: 'text-slate-400 border-b border-slate-700',
      minimal: 'text-slate-500 border-b border-slate-200',
    }[this.theme];
  }

  get tdCls() {
    return { light: 'text-slate-700', dark: 'text-slate-300', minimal: 'text-slate-700' }[
      this.theme
    ];
  }

  get rowBorderCls() {
    return {
      light: 'border-b border-slate-100',
      dark: 'border-b border-slate-700/50',
      minimal: 'border-b border-slate-100',
    }[this.theme];
  }

  get rowHoverCls() {
    return {
      light: 'hover:bg-indigo-50/50',
      dark: 'hover:bg-slate-800/60',
      minimal: 'hover:bg-slate-50',
    }[this.theme];
  }

  get stripedCls() {
    return this.variant === 'striped'
      ? {
          light: 'even:bg-slate-50/60',
          dark: 'even:bg-slate-800/30',
          minimal: 'even:bg-slate-50/40',
        }[this.theme]
      : '';
  }

  get borderedCls() {
    return this.variant === 'bordered'
      ? {
          light: '[&_td]:border-r [&_td]:border-slate-100 [&_th]:border-r [&_th]:border-slate-200',
          dark: '[&_td]:border-r [&_td]:border-slate-700 [&_th]:border-r [&_th]:border-slate-700',
          minimal:
            '[&_td]:border-r [&_td]:border-slate-100 [&_th]:border-r [&_th]:border-slate-200',
        }[this.theme]
      : '';
  }

  get pagCls() {
    return {
      light: 'bg-white border-t border-slate-100 text-slate-600',
      dark: 'bg-slate-900 border-t border-slate-700 text-slate-400',
      minimal: 'border-t border-slate-100 text-slate-600',
    }[this.theme];
  }

  get inputCls() {
    return {
      light: 'border-slate-200 bg-white text-slate-700',
      dark: 'border-slate-600 bg-slate-800 text-slate-300',
      minimal: 'border-slate-200 bg-white text-slate-700',
    }[this.theme];
  }

  get btnPageCls() {
    return {
      light: 'text-slate-600 hover:bg-slate-100',
      dark: 'text-slate-400 hover:bg-slate-800',
      minimal: 'text-slate-600 hover:bg-slate-100',
    }[this.theme];
  }

  get emptyTxtCls() {
    return { light: 'text-slate-400', dark: 'text-slate-500', minimal: 'text-slate-400' }[
      this.theme
    ];
  }

  get skeletonCls() {
    return { light: 'bg-slate-200', dark: 'bg-slate-700', minimal: 'bg-slate-200' }[this.theme];
  }

  ngOnChanges() {
    this.size = this.pageSize;
    this.page = 1;
    this.selected.clear();
  }

  sort(col: TableColumn) {
    if (!col.sortable) return;
    this.sortDir = this.sortKey === col.key && this.sortDir === 'asc' ? 'desc' : 'asc';
    this.sortKey = col.key;
    this.cdr.markForCheck();
  }

  goTo(p: number) {
    this.page = Math.max(1, Math.min(p, this.totalPages));
    this.selected.clear();
    this.cdr.markForCheck();
  }

  onSizeChange(s: number) {
    this.size = +s;
    this.page = 1;
    this.selected.clear();
    this.cdr.markForCheck();
  }

  gotoPage() {
    const n = parseInt(this.gotoVal);
    if (!isNaN(n)) {
      this.goTo(n);
      this.gotoVal = '';
    }
  }

  toggleRow(i: number) {
    this.selected.has(i) ? this.selected.delete(i) : this.selected.add(i);
    this.emit();
  }

  toggleAll() {
    this.selected.size === this.paged.length
      ? this.selected.clear()
      : this.paged.forEach((_, i) => this.selected.add(i));
    this.emit();
  }

  emit() {
    this.selectionChange.emit([...this.selected].map((i) => this.paged[i]));
    this.cdr.markForCheck();
  }

  badgeCls(col: TableColumn, val: any) {
    const t = (col.badgeMap || {})[val] || 'neutral';
    return {
      income: 'bg-emerald-100 text-emerald-700',
      expense: 'bg-red-100 text-red-600',
      pending: 'bg-amber-100 text-amber-700',
      neutral: 'bg-slate-100 text-slate-600',
    }[t];
  }

  fmt(col: TableColumn, val: any) {
    if (col.type === 'currency')
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    if (col.type === 'date') return new Date(val).toLocaleDateString('vi-VN');
    return val ?? '—';
  }

  amtCls(col: TableColumn, val: any) {
    if (col.type !== 'currency' && col.type !== 'number') return '';
    return val > 0 ? 'text-emerald-600 font-medium' : val < 0 ? 'text-red-500 font-medium' : '';
  }

  allChecked() {
    return this.paged.length > 0 && this.selected.size === this.paged.length;
  }
  someChecked() {
    return this.selected.size > 0 && this.selected.size < this.paged.length;
  }

  colSpan() {
    return this.columns.length + (this.selectable ? 1 : 0);
  }

  sortIconClasses(columnKey: string): string {
    if (this.sortKey !== columnKey) {
      return 'fa-solid fa-sort'; // Default sort icon
    }
    return this.sortDir === 'asc' ? 'fa-solid fa-sort-up' : 'fa-solid fa-sort-down';
  }
}
