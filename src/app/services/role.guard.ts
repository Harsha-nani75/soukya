import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
   const auth = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['role'];
  const userRole = auth.getRole();

  if (userRole === expectedRole) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
