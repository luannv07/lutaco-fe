import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/base-response';
import { DashboardSummary } from '../../models/dashboard';
import { BaseService } from '../../shared/services/base.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends BaseService {
  protected readonly apiUrl = 'dashboard';

  getSummary(period: string = 'LAST_1_MONTH'): Observable<BaseResponse<DashboardSummary>> {
    const params = new HttpParams().set('period', period);
    return this.http.get<BaseResponse<DashboardSummary>>(`${this.baseUrl}/${this.apiUrl}/summary`, {
      params,
    });
  }
}
