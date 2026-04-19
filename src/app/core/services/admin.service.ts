import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/base-response';
import {
  Role,
  RoleSearchFilter,
  RolesPageData,
  UserAuditFilter,
  UserAuditPageData,
  UserRoleRequest,
  UserSearchFilter,
  UserStatusSetRequest,
  UsersPageData,
} from '../../models/admin';
import { BaseService } from '../../shared/services/base.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService extends BaseService {
  protected readonly apiUrl = 'users';

  searchUsers(filter: UserSearchFilter, page: number, size: number): Observable<BaseResponse<UsersPageData>> {
    let params = new HttpParams()
      .set('page', String(page + 1))
      .set('size', String(size));

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<BaseResponse<UsersPageData>>(`${this.baseUrl}/users`, { params });
  }

  searchRoles(filter: RoleSearchFilter, page: number, size: number): Observable<BaseResponse<RolesPageData>> {
    let params = new HttpParams()
      .set('page', String(page + 1))
      .set('size', String(size));

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<BaseResponse<RolesPageData>>(`${this.baseUrl}/roles`, { params });
  }

  updateUserRole(userId: string, request: UserRoleRequest): Observable<BaseResponse<void>> {
    return this.http.patch<BaseResponse<void>>(`${this.baseUrl}/users/${userId}/role`, request);
  }

  updateUserStatus(userId: string, request: UserStatusSetRequest): Observable<BaseResponse<void>> {
    return this.http.patch<BaseResponse<void>>(`${this.baseUrl}/users/${userId}/status`, request);
  }

  searchUserAuditLogs(
    filter: UserAuditFilter,
    page: number,
    size: number,
  ): Observable<BaseResponse<UserAuditPageData>> {
    let params = new HttpParams()
      .set('page', String(page + 1))
      .set('size', String(size));

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<BaseResponse<UserAuditPageData>>(`${this.baseUrl}/user-audit-logs`, { params });
  }

  deleteUserAuditLogs(filter: UserAuditFilter): Observable<BaseResponse<void>> {
    return this.http.request<BaseResponse<void>>('DELETE', `${this.baseUrl}/user-audit-logs`, {
      body: filter,
    });
  }

  confirmWebhook(webhookUrl: string): Observable<BaseResponse<void>> {
    return this.http.post<BaseResponse<void>>(`${this.baseUrl}/confirm-webhook`, {
      webhookUrl,
    });
  }

  getRoleById(roleId: number): Observable<BaseResponse<Role>> {
    return this.http.get<BaseResponse<Role>>(`${this.baseUrl}/roles/${roleId}`);
  }
}
