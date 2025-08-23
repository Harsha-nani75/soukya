import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  //---------local useage--------
  // const auth = inject(AuthService);
  // const router = inject(Router);

  // const expectedRole = route.data['role'];
  // const userRole = auth.getRole();

  // if (userRole === expectedRole) {
  //   return true;
  // } else {
  //   router.navigate(['/']);
  //   return false;
  // }

  //-------------API usage-------------
  const auth = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['role'];   // role from route config
  const token = localStorage.getItem('token'); // check login
  const userRole = auth.getRole();

  if (token && userRole === expectedRole) {
    return true;  // ✅ allowed
  } else {
    router.navigate(['/login']); // redirect if not logged in or wrong role
    return false;
  }
};
