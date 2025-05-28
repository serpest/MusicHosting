import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})

export class UserService {

  private baseUrl = 'http://localhost:3000';

  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/login`, { email, password });
  }

  register(email: string, name: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/register`, { email, name, password });
  }

  changePassword(email: string, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/change-password`, { email, oldPassword, newPassword });
  }

  delete(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/delete-account`, { email, password });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/forgot-password`, { email });
  }

  resetPassword(email: string, otp: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/reset-password`, { email, otp, newPassword });
  }

  validateToken(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/validate-token`);
  }

  setLoggedIn(status: boolean) {
    this.loggedIn.next(status);
  }

  checkAuth() {
    this.validateToken().subscribe({
      next: () => this.setLoggedIn(true),
      error: () => this.setLoggedIn(false)
    });
  }

  changeName(newName: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/change-name`, { name: newName });
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/me`);
  }
}
