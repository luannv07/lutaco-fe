import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/base-response';
import { Page } from '../../models/page';
import { Transaction, TransactionCreateRequest, TransactionFilter } from '../../models/transaction';
import { BaseService } from '../../shared/services/base.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService extends BaseService {
  protected readonly apiUrl = 'transactions';

  searchTransactions(
    filter: TransactionFilter,
    page: number,
    size: number,
  ): Observable<BaseResponse<Page<Transaction>>> {
    let params = new HttpParams()
      .set('page', String(page + 1))
      .set('size', String(size));

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<BaseResponse<Page<Transaction>>>(`${this.baseUrl}/${this.apiUrl}`, { params });
  }

  createTransaction(request: TransactionCreateRequest): Observable<BaseResponse<Transaction>> {
    return this.http.post<BaseResponse<Transaction>>(`${this.baseUrl}/${this.apiUrl}`, request);
  }
}
