import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse } from '../../models/base-response';

@Injectable({
  providedIn: 'root',
})
export class AiChatService {
  private readonly http = inject(HttpClient);

  chat(message: string): Observable<BaseResponse<unknown>> {
    const params = new HttpParams().set('message', message);
    return this.http.get<BaseResponse<unknown>>('/api/ai/chat', { params });
  }
}
