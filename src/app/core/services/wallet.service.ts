import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../shared/services/base.service';
import { BaseResponse } from '../../models/base-response';
import { Wallet, WalletCreateRequest, WalletUpdateRequest } from '../../models/wallet';

@Injectable({
  providedIn: 'root',
})
export class WalletService extends BaseService {
  protected readonly apiUrl = 'wallets';

  getMyWallets(): Observable<BaseResponse<Wallet[]>> {
    return this.http.get<BaseResponse<Wallet[]>>(`${this.baseUrl}/${this.apiUrl}`);
  }

  createWallet(request: WalletCreateRequest): Observable<BaseResponse<Wallet>> {
    return this.create(request);
  }

  updateWallet(id: string, request: WalletUpdateRequest): Observable<BaseResponse<Wallet>> {
    return this.update(id, request);
  }

  toggleWalletStatus(id: string): Observable<BaseResponse<void>> {
    return this.http.patch<BaseResponse<void>>(`${this.baseUrl}/${this.apiUrl}/${id}/toggle-status`, {});
  }
}
