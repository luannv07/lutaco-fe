import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  protected readonly apiUrl: string = 'users'; // Corresponds to /api/v1/users

  constructor() {
    super();
  }
}
