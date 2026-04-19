import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Observable, tap } from 'rxjs';
import { User, UserUpdateRequest } from '../../models/user';
import { BaseResponse } from '../../models/base-response';
import { LOCAL_STORAGE_KEY } from './local-storage.service';

export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  protected readonly apiUrl: string = 'users';

  private notifyUserInfoUpdated(): void {
    if (!this.isBrowser()) {
      return;
    }

    window.dispatchEvent(new CustomEvent('user-info-updated'));
  }

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
      currentUser.userStatus?.value !== user.userStatus?.value ||
      currentUser.userPlan?.value !== user.userPlan?.value ||
      currentUser.roleName !== user.roleName ||
      currentUser.fullName !== user.fullName
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
          this.notifyUserInfoUpdated();
        }
      }),
    );
  }

  updateMyProfile(userId: string, updateRequest: UserUpdateRequest): Observable<BaseResponse<User>> {
    return this.update(userId, updateRequest).pipe(
      tap((response: BaseResponse<User>) => {
        if (response && response.data && this.shouldUpdateCachedUser(response.data)) {
          this.localStorageService.set(LOCAL_STORAGE_KEY.USER_INFO_KEY, response.data);
          this.notifyUserInfoUpdated();
        }
      }),
    );
  }

  updatePassword(userId: string, passwordRequest: UpdatePasswordRequest): Observable<BaseResponse<void>> {
    return this.http.patch<BaseResponse<void>>(
      `${this.baseUrl}/${this.apiUrl}/${userId}/password`,
      passwordRequest,
    );
  }
}
