// See https://medium.com/@sehban.alam/best-practices-for-storing-access-tokens-in-angular-0d835c14e72c

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  
  private TOKEN_KEY = 'userToken';

  constructor() {}

  public setToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  public removeToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

}
