import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { UserStatus } from '../enums/user.enum';

export const guestGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (!authService.isAuthenticated()) {
    return true;
  }

  if (authService.getCurrentUserStatus() === UserStatus.PENDING_VERIFICATION) {
    if (state.url.startsWith('/auth/verify-otp')) {
      return true;
    }

    return router.createUrlTree(['/auth/verify-otp']);
  }

  return router.createUrlTree(['/dashboard']);
};
