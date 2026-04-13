import { Component, inject } from '@angular/core';
import { SHARED_COMPONENTS } from '../../shared/base-imports';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { User } from '../../models/user'; // Import User model

@Component({
  selector: 'app-dashboard',
  imports: [...SHARED_COMPONENTS],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private authService: AuthService = inject(AuthService);
  private toastService: ToastService = inject(ToastService);
  private translateService: TranslateService = inject(TranslateService);
  private router: Router = inject(Router);
  private userService: UserService = inject(UserService);

  isLoggingOut: boolean = false;
  currentUser: User | null = null; // Property to store user data
  isLoadingUser: boolean = false; // Loading state for getMe()

  protected logout() {
    this.isLoggingOut = true;

    this.authService.logout().subscribe({
      next: () => {
        this.toastService.success(this.translateService.instant('auth.logout.success')); // Use specific success message
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        const message =
          error?.error?.message || this.translateService.instant('common.messages.error'); // Use generic error message
        this.toastService.error(message);
        this.router.navigate(['/auth/login']);
      },
      complete: () => {
        this.isLoggingOut = false;
      },
    });
  }

  protected getMe() {
    this.isLoadingUser = true; // Set loading state

    this.userService.getDetail('me').subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.currentUser = response.data;
          this.toastService.success(this.translateService.instant('common.messages.success')); // Use specific success message
        } else {
          const message =
            response.message || this.translateService.instant('common.messages.error'); // Use generic error message
          this.toastService.error(message);
        }
      },
      error: (error) => {
        const message =
          error?.error?.message || this.translateService.instant('common.messages.error'); // Use generic error message
        this.toastService.error(message);
      },
      complete: () => {
        this.isLoadingUser = false; // Reset loading state
      },
    });
  }

  protected updatePlan() {
    console.log('updated plan');
  }
}
