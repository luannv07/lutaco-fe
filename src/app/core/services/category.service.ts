import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/base-response';
import { Category, CategoryFilter, CategoryRequest } from '../../models/category';
import { Page } from '../../models/page';
import { BaseService } from '../../shared/services/base.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends BaseService {
  protected readonly apiUrl = 'categories';

  searchCategories(
    page: number,
    size: number,
    filter?: CategoryFilter,
  ): Observable<BaseResponse<Page<Category>>> {
    let params = new HttpParams().set('page', String(page + 1)).set('size', String(size));

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, String(value));
        }
      });
    }

    return this.http.get<BaseResponse<Page<Category>>>(`${this.baseUrl}/${this.apiUrl}`, { params });
  }

  createCategory(request: CategoryRequest): Observable<BaseResponse<object>> {
    return this.http.post<BaseResponse<object>>(`${this.baseUrl}/${this.apiUrl}`, request);
  }

  updateCategory(id: string, request: CategoryRequest): Observable<BaseResponse<object>> {
    return this.http.put<BaseResponse<object>>(`${this.baseUrl}/${this.apiUrl}/${id}`, request);
  }
}
