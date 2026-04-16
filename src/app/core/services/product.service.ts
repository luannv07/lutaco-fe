import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/base-response';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseService {
  protected readonly apiUrl: string = 'products';

  constructor() {
    super();
  }

  getAll(): Observable<BaseResponse<Product[]>> {
    return this.http.get<BaseResponse<Product[]>>(`${this.baseUrl}/${this.apiUrl}`);
  }
}


