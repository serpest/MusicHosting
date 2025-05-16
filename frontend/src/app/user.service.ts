import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


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

  validateToken(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/validate-token`);
  }

}
