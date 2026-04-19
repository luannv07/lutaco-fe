import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/base-response';
import { Page } from '../../models/page';
import {
  RecurringTransaction,
  RecurringTransactionFilter,
  RecurringTransactionRequest,
} from '../../models/recurring-transaction';
import { BaseService } from '../../shared/services/base.service';

@Injectable({
  providedIn: 'root',
})
export class RecurringTransactionService extends BaseService {
  protected readonly apiUrl = 'recurring-transactions';

  searchRecurringTransactions(
    filter: RecurringTransactionFilter,
    page: number,
    size: number,
  ): Observable<BaseResponse<Page<RecurringTransaction>>> {
    let params = new HttpParams()
      .set('page', String(page + 1))
      .set('size', String(size));

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<BaseResponse<Page<RecurringTransaction>>>(`${this.baseUrl}/${this.apiUrl}`, {
      params,
    });
  }

  createRecurringTransaction(
    request: RecurringTransactionRequest,
  ): Observable<BaseResponse<RecurringTransaction>> {
    return this.http.post<BaseResponse<RecurringTransaction>>(`${this.baseUrl}/${this.apiUrl}`, request);
  }

  deleteRecurringTransaction(id: number): Observable<BaseResponse<void>> {
    return this.http.delete<BaseResponse<void>>(`${this.baseUrl}/${this.apiUrl}/${id}`);
  }
}
