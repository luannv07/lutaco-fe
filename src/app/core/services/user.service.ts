import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Observable, tap } from 'rxjs';
import { User } from '../../models/user';
import { BaseResponse } from '../../models/base-response';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  protected readonly apiUrl: string = 'users';

  constructor() {
    super();
  }

  getMySelf(): Observable<BaseResponse<User>> {
    return this.http.get<BaseResponse<User>>(`${this.baseUrl}/${this.apiUrl}/me`).pipe(
      tap((response: BaseResponse<User>) => {
        if (response && response.data) {
          this.localStorageService.set('user_info', response.data);
        }
      }),
    );
  }
}
