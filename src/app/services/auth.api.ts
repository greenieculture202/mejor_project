import { Injectable } from '@angular/core';
import { ApiBase } from './api.base';
import { Observable, BehaviorSubject, tap, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface User {
  id?: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private api: ApiBase) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    try {
      const stored = localStorage.getItem('greenie.loggedIn');
      if (stored === '1' || stored === 'true') {
        const rawUser = localStorage.getItem('greenie.currentUser');
        const user = rawUser ? JSON.parse(rawUser) : null;
        this.currentUserSubject.next(user);
      }
    } catch (e) {
      this.currentUserSubject.next(null);
    }
  }

  setCurrentUser(user: User | null) {
    this.currentUserSubject.next(user);
    if (user) {
      localStorage.setItem('greenie.loggedIn', '1');
      localStorage.setItem('greenie.currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('greenie.loggedIn');
      localStorage.removeItem('greenie.currentUser');
      localStorage.removeItem('greenie.token');
    }
  }

  register(name: string, email: string, password: string, phone: string, address: string, role = 'user'): Observable<AuthResponse> {
    const payload = { name, email, password, phone, address, role };
    return this.api.post<AuthResponse>('auth/register', payload).pipe(
      tap(res => {
        if (res && res.token) {
          localStorage.setItem('greenie.token', res.token);
          this.setCurrentUser(res.user);
        }
      }),
      catchError(err => {
        console.warn('Registration offline fallback', err);
        // Create local user
        const newUser: User = {
          id: 'local-' + Date.now(),
          name, email, phone, address, role
        };
        const mockResponse: AuthResponse = {
          token: 'dummy-token-' + Date.now(),
          user: newUser
        };

        // Save to local users list for Admin visibility
        this.saveLocalUser(newUser, password);

        // Save to current session
        localStorage.setItem('greenie.token', mockResponse.token);
        this.setCurrentUser(newUser);

        return of(mockResponse);
      })
    );
  }

  // Helper to save to local admin list
  private saveLocalUser(user: any, password?: string) {
    try {
      const raw = localStorage.getItem('greenie.users');
      const users = raw ? JSON.parse(raw) : [];
      // Check duplicate
      if (!users.find((u: any) => u.email === user.email)) {
        users.push({ ...user, password, isLocal: true, createdAt: new Date().toISOString() });
        localStorage.setItem('greenie.users', JSON.stringify(users));
      }
    } catch (e) { }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/login', { email, password }).pipe(
      tap(res => {
        if (res && res.token) {
          localStorage.setItem('greenie.token', res.token);
          this.setCurrentUser(res.user);
        }
      }),
      catchError(err => {
        console.warn('Login offline fallback', err);
        // Try to verify against local users
        try {
          const raw = localStorage.getItem('greenie.users');
          const users = raw ? JSON.parse(raw) : [];
          const found = users.find((u: any) => u.email === email && u.password === password);

          if (found) {
            const { password, ...safeUser } = found;
            const mockResponse: AuthResponse = {
              token: 'dummy-token-' + Date.now(),
              user: safeUser
            };
            localStorage.setItem('greenie.token', mockResponse.token);
            this.setCurrentUser(safeUser);
            return of(mockResponse);
          }
        } catch (e) { }
        throw err;
      })
    );
  }

  logout() {
    this.setCurrentUser(null);
  }

  checkStatus(): Observable<any> {
    const token = localStorage.getItem('greenie.token');

    // If it's a local/dummy session, check localStorage
    if (token && token.startsWith('dummy-token-')) {
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        try {
          const raw = localStorage.getItem('greenie.users');
          const users = raw ? JSON.parse(raw) : [];
          const found = users.find((u: any) => u.email === currentUser.email);
          if (found && found.isBlocked) {
            return of({ isBlocked: true });
          }
        } catch (e) { }
      }
      return of({ isBlocked: false });
    }

    // Default to API check
    return this.api.get<any>('auth/status', token || '');
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  changePassword(oldPass: string, newPass: string): Observable<boolean> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return of(false);

    // 1. Try API if real backend exists (omitted for now as we seem to use local fallback mostly or api is mocked)
    // For now, implementing the local storage update logic strictly as requested.

    try {
      const raw = localStorage.getItem('greenie.users');
      const users: any[] = raw ? JSON.parse(raw) : [];
      const index = users.findIndex((u: any) => u.email === currentUser.email);

      if (index !== -1) {
        // Verify old password
        if (users[index].password !== oldPass) {
          throw new Error('Incorrect old password');
        }

        // Update password
        users[index].password = newPass;
        localStorage.setItem('greenie.users', JSON.stringify(users));
        return of(true);
      }
    } catch (e) {
      console.error('Password change failed', e);
      return of(false);
    }
    return of(false);
  }
}

