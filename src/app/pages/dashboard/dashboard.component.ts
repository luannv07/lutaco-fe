import { Component, inject } from '@angular/core';
import { SHARED_COMPONENTS } from '../../shared/base-imports';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router'; // Import Router

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
  private router: Router = inject(Router); // Inject Router

  isLoggingOut: boolean = false; // Add loading state

  protected logout() {
    this.isLoggingOut = true; // Set loading state to true

    this.authService.logout().subscribe({
      next: () => {
        this.toastService.success(this.translateService.instant('auth.logout.successMessage')); // Show success toast
        this.router.navigate(['/auth/login']); // Navigate after success
      },
      error: (error) => {
        const message = error?.error?.message || this.translateService.instant('auth.logout.errorMessage');
        this.toastService.error(message); // Show error toast
        this.router.navigate(['/auth/login']); // Navigate even on error to ensure client-side logout
      },
      complete: () => {
        this.isLoggingOut = false; // Reset loading state
      }
    });
  }
}
