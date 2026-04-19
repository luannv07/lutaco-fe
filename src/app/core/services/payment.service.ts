import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/base-response';
import { PayOSCreatedData, PayOSEnvelope, PayOSUserTransaction } from '../../models/payment';
import { BaseService } from '../../shared/services/base.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService extends BaseService {
  protected readonly apiUrl = 'payment';

  createPremiumPayment(): Observable<BaseResponse<PayOSEnvelope<PayOSCreatedData>>> {
    return this.http.post<BaseResponse<PayOSEnvelope<PayOSCreatedData>>>(
      `${this.baseUrl}/${this.apiUrl}/premium-user`,
      {},
    );
  }

  getTransactionsByUserId(userId: string): Observable<BaseResponse<PayOSUserTransaction[]>> {
    return this.http.get<BaseResponse<PayOSUserTransaction[]>>(
      `${this.baseUrl}/${this.apiUrl}/users/${userId}`,
    );
  }
}
