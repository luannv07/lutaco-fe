import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BaseResponse } from '../../models/base-response';
import { Page } from '../../models/page';

// Abstract base service for CRUD operations.
@Injectable()
export abstract class BaseService {
  // The specific API path for the resource (e.g., 'users'). Must be implemented by the extending class.
  protected abstract readonly apiUrl: string;
  protected readonly baseUrl = environment.baseUrl;

  constructor(protected http: HttpClient) {}

  // Create a new resource.
  create(request: any): Observable<BaseResponse<any>> {
    return this.http.post<BaseResponse<any>>(`${this.baseUrl}/${this.apiUrl}`, request);
  }

  // Get a single resource by its ID.
  getDetail(id: string | number): Observable<BaseResponse<any>> {
    return this.http.get<BaseResponse<any>>(`${this.baseUrl}/${this.apiUrl}/${id}`);
  }

  // Search for resources with pagination.
  search(request: any, page: number, size: number): Observable<BaseResponse<Page<any>>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (request) {
      Object.keys(request).forEach((key) => {
        const value = request[key];
        if (value !== null && value !== undefined && value !== '') {
          params = params.append(key, value);
        }
      });
    }

    return this.http.get<BaseResponse<Page<any>>>(`${this.baseUrl}/${this.apiUrl}`, { params });
  }

  // Update an existing resource.
  update(id: string | number, request: any): Observable<BaseResponse<any>> {
    return this.http.put<BaseResponse<any>>(`${this.baseUrl}/${this.apiUrl}/${id}`, request);
  }

  // Delete a resource by its ID.
  deleteById(id: string | number): Observable<BaseResponse<void>> {
    return this.http.delete<BaseResponse<void>>(`${this.baseUrl}/${this.apiUrl}/${id}`);
  }
}
