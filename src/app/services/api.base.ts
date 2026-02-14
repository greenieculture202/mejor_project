import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

// Change this base URL if your backend runs elsewhere
export const API_BASE = 'http://localhost:4000/api';

@Injectable({ providedIn: 'root' })
export class ApiBase {
  constructor(protected http: HttpClient) { }

  protected authHeaders(token?: string) {
    if (!token) return undefined;
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  get<T>(path: string, token?: string): Observable<T> {
    return this.http.get<T>(`${API_BASE}/${path}`, this.authHeaders(token))
      .pipe(
        retry(3), // Retry up to 3 times before failing
        catchError(err => {
          console.error(`Error in GET ${path}:`, err);
          return throwError(() => err);
        })
      );
  }

  post<T>(path: string, body: any, token?: string): Observable<T> {
    return this.http.post<T>(`${API_BASE}/${path}`, body, this.authHeaders(token))
      .pipe(
        retry(2),
        catchError(err => {
          console.error(`Error in POST ${path}:`, err);
          return throwError(() => err);
        })
      );
  }

  put<T>(path: string, body: any, token?: string): Observable<T> {
    return this.http.put<T>(`${API_BASE}/${path}`, body, this.authHeaders(token))
      .pipe(
        retry(2),
        catchError(err => {
          console.error(`Error in PUT ${path}:`, err);
          return throwError(() => err);
        })
      );
  }

  delete<T>(path: string, token?: string): Observable<T> {
    return this.http.delete<T>(`${API_BASE}/${path}`, this.authHeaders(token))
      .pipe(
        retry(2),
        catchError(err => {
          console.error(`Error in DELETE ${path}:`, err);
          return throwError(() => err);
        })
      );
  }
}
