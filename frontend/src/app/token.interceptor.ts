// See https://medium.com/@sehban.alam/best-practices-for-storing-access-tokens-in-angular-0d835c14e72c

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from './token.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();
  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', token)
    });
    return next(cloned);
  }
  return next(req);
};
