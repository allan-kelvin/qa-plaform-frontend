import {
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log('[Interceptor] Token:', token);

  if (token) {
    console.log('[Interceptor] Token encontrado:', token);
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  console.warn('[Interceptor] Nenhum token encontrado. Requisição enviada sem Authorization.');
  return next(req);
};
