import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})

export class UserService {

  private baseUrl = 'http://localhost:3000';

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

  async isTokenValid(): Promise<boolean> {
    try {
      // firstValueFrom() is used to convert the Observable to a Promise
      await firstValueFrom(this.validateToken());
      return true;
    } catch (error) {
      return false;
    }
  }
  
}
