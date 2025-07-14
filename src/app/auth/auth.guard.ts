import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();

  console.log('Auth Guard (Signal): Autenticado?', isAuthenticated);

  if (isAuthenticated) return true;

  router.navigate(['/login']);
  return false;
};
