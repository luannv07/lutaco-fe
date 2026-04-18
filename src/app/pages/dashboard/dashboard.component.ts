import { ChangeDetectorRef, Component, inject, NgZone } from '@angular/core';
import { SHARED_COMPONENTS, SHARED_IMPORTS } from '../../shared/base-imports';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { User } from '../../models/user';
import { BaseComponent } from '../../shared/components/base/base.component';
import { finalize, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [...SHARED_IMPORTS, ...SHARED_COMPONENTS],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent extends BaseComponent<User> {
  private authService: AuthService = inject(AuthService);
  private toastService: ToastService = inject(ToastService);
  private translateService: TranslateService = inject(TranslateService);
  protected override router: Router = inject(Router);
  private userService: UserService = inject(UserService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private ngZone: NgZone = inject(NgZone);

  public isLoggingOut: boolean = false;
  public currentUser: User | null = null;
  public isLoadingUser: boolean = false;

  protected override service = null as any;

  protected override initForms(): void {
    // No forms needed for dashboard
  }

  protected override onBrowserInit(): void {
    // Auto-load user data on dashboard load to show global loading effect
    this.getMe();
  }

  protected logout() {
    this.isLoggingOut = true;

    this.authService.logout().subscribe({
      next: () => {
        this.toastService.success(
          this.translateService.instant('dashboard.messages.logoutSuccess'),
        );
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        const message =
          error?.error?.message || this.translateService.instant('common.messages.error');
        this.toastService.error(message);
        this.router.navigate(['/auth/login']);
      },
      complete: () => {
        this.isLoggingOut = false;
      },
    });
  }

  protected getMe() {
    this.isLoadingUser = true;

    this.userService
      .getMySelf()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.runInAngular(() => {
            this.isLoadingUser = false;
            this.cdr.detectChanges();
          });
        }),
      )
      .subscribe({
      next: (response) => {
        this.runInAngular(() => {
          if (response.success && response.data) {
            this.currentUser = response.data;
            this.toastService.success(this.translateService.instant('common.messages.success'));
          } else {
            const message =
              response.message || this.translateService.instant('common.messages.error');
            this.toastService.error(message);
          }
          this.cdr.detectChanges();
        });
      },
      error: (error) => {
        this.runInAngular(() => {
          const message =
            error?.error?.message || this.translateService.instant('common.messages.error');
          this.toastService.error(message);
          this.cdr.detectChanges();
        });
      },
    });
  }

  private runInAngular(action: () => void): void {
    if (NgZone.isInAngularZone()) {
      action();
      return;
    }

    this.ngZone.run(action);
  }

  protected updatePlan() {
    console.log('updated plan');
  }
}
