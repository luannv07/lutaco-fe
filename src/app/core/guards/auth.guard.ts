import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { UserStatus } from '../enums/user.enum';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // SSR: không check, để client tự handle sau khi hydrate
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (authService.getCurrentUserStatus() === UserStatus.PENDING_VERIFICATION) {
    return router.createUrlTree(['/auth/verify-otp']);
  }

  if (authService.isAuthenticated()) {
    return true;
  }


  return router.createUrlTree(['/auth/login']);
};
