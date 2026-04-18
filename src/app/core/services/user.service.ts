import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Observable, tap } from 'rxjs';
import { User, UserUpdateRequest } from '../../models/user';
import { BaseResponse } from '../../models/base-response';
import { LOCAL_STORAGE_KEY } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  protected readonly apiUrl: string = 'users';

  private shouldUpdateCachedUser(user: User): boolean {
    // Only update cache in browser environment
    if (!this.isBrowser()) {
      return false;
    }

    const currentUser = this.localStorageService.get<User>(LOCAL_STORAGE_KEY.USER_INFO_KEY);
    if (!currentUser) {
      return true;
    }

    return (
      currentUser.id !== user.id ||
      currentUser.updatedDate !== user.updatedDate ||
      currentUser.userStatus?.value !== user.userStatus?.value
    );
  }

  constructor() {
    super();
  }

  getMySelf(): Observable<BaseResponse<User>> {
    return this.http.get<BaseResponse<User>>(`${this.baseUrl}/${this.apiUrl}/me`).pipe(
      tap((response: BaseResponse<User>) => {
        if (response && response.data && this.shouldUpdateCachedUser(response.data)) {
          this.localStorageService.set(LOCAL_STORAGE_KEY.USER_INFO_KEY, response.data);
        }
      }),
    );
  }

  updateMyProfile(userId: string, updateRequest: UserUpdateRequest): Observable<BaseResponse<User>> {
    return this.update(userId, updateRequest).pipe(
      tap((response: BaseResponse<User>) => {
        if (response && response.data && this.shouldUpdateCachedUser(response.data)) {
          this.localStorageService.set(LOCAL_STORAGE_KEY.USER_INFO_KEY, response.data);
        }
      }),
    );
  }
}
