import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, NgZone } from '@angular/core';
import { SHARED_COMPONENTS, SHARED_IMPORTS } from '../../shared/base-imports';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { User } from '../../models/user';
import { BaseComponent } from '../../shared/components/base/base.component';
import { finalize, takeUntil } from 'rxjs';
import { AiChatService } from '../../core/services/ai-chat.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardInsight, DashboardSummary, InsightLevel, WalletSummaryItem } from '../../models/dashboard';

@Component({
  selector: 'app-dashboard',
  imports: [...SHARED_IMPORTS, ...SHARED_COMPONENTS],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent extends BaseComponent<User> {
  private authService: AuthService = inject(AuthService);
  private toastService: ToastService = inject(ToastService);
  private translateService: TranslateService = inject(TranslateService);
  protected override router: Router = inject(Router);
  private userService: UserService = inject(UserService);
  private aiChatService: AiChatService = inject(AiChatService);
  private dashboardService: DashboardService = inject(DashboardService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private ngZone: NgZone = inject(NgZone);

  public isLoggingOut: boolean = false;
  public currentUser: User | null = null;
  public isLoadingUser: boolean = false;
  public aiPrompt: string = '';
  public aiAnswer: string = '';
  public isAiLoading: boolean = false;
  public isLoadingSummary: boolean = false;
  public summary: DashboardSummary | null = null;
  public insights: DashboardInsight[] = [];
  public topWallets: WalletSummaryItem[] = [];

  protected override service = null as any;

  protected override initForms(): void {
    // No forms needed for dashboard
  }

  protected override onBrowserInit(): void {
    this.refreshDashboard();
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

  protected refreshDashboard(): void {
    this.getMe();
    this.loadDashboardSummary();
  }

  protected goToWallets(): void {
    this.router.navigate(['/wallets']);
  }

  protected goToTransactions(): void {
    this.router.navigate(['/transactions']);
  }

  private runInAngular(action: () => void): void {
    if (NgZone.isInAngularZone()) {
      action();
      return;
    }

    this.ngZone.run(action);
  }

  protected getInsightClass(level: InsightLevel): string {
    if (level === 'DANGER') {
      return 'rounded-lg border border-red-200 bg-red-50 p-3 text-red-800';
    }

    if (level === 'WARN') {
      return 'rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800';
    }

    return 'rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800';
  }

  protected getInsightIconClass(level: InsightLevel): string {
    if (level === 'DANGER') {
      return 'fa-solid fa-circle-xmark';
    }

    if (level === 'WARN') {
      return 'fa-solid fa-triangle-exclamation';
    }

    return 'fa-solid fa-circle-check';
  }

  protected getInsightTextKey(code: string): string {
    const supportedCodes = new Set<string>([
      'EXPENSE_INCREASE',
      'EXPENSE_DECREASE',
      'INCOME_INCREASE',
      'INCOME_DECREASE',
      'NEGATIVE_BALANCE',
      'LOW_BALANCE',
      'CATEGORY_OVER_SPENDING',
      'CATEGORY_DOMINANT',
    ]);

    if (supportedCodes.has(code)) {
      return `dashboard.insights.codes.${code}`;
    }

    return 'dashboard.insights.codes.DEFAULT';
  }

  private loadDashboardSummary(): void {
    if (this.isLoadingSummary) {
      return;
    }

    this.isLoadingSummary = true;

    this.dashboardService
      .getSummary('LAST_1_MONTH')
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.runInAngular(() => {
            this.isLoadingSummary = false;
            this.cdr.detectChanges();
          });
        }),
      )
      .subscribe({
        next: (response) => {
          this.runInAngular(() => {
            if (response.success && response.data) {
              this.summary = response.data;
              this.insights = response.data.insight || [];
              this.topWallets = (response.data.walletSummary?.wallets || []).slice(0, 5);
              this.cdr.detectChanges();
              return;
            }

            this.summary = null;
            this.insights = [];
            this.topWallets = [];
            this.toastService.warning(
              response.message || this.translateService.instant('dashboard.messages.summaryLoadError'),
            );
            this.cdr.detectChanges();
          });
        },
        error: (error: unknown) => {
          this.runInAngular(() => {
            this.summary = null;
            this.insights = [];
            this.topWallets = [];
            const message =
              (error as { error?: { message?: string } })?.error?.message ||
              this.translateService.instant('dashboard.messages.summaryLoadError');
            this.toastService.warning(message);
            this.cdr.detectChanges();
          });
        },
      });
  }

  protected askAi(): void {
    const prompt = this.aiPrompt.trim();
    if (!prompt || this.isAiLoading) {
      return;
    }

    this.isAiLoading = true;
    this.aiChatService
      .chat(prompt)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.runInAngular(() => {
            this.isAiLoading = false;
            this.cdr.detectChanges();
          });
        }),
      )
      .subscribe({
        next: (response) => {
          this.runInAngular(() => {
            if (response.success) {
              this.aiAnswer = this.toAiText(response);
              return;
            }

            this.aiAnswer = '';
            this.toastService.error(response.message || this.translateService.instant('common.messages.error'));
          });
        },
        error: (error: unknown) => {
          this.runInAngular(() => {
            this.aiAnswer = '';
            const message =
              (error as { error?: { message?: string } })?.error?.message ||
              this.translateService.instant('dashboard.ai.messages.error');
            this.toastService.error(message);
          });
        },
      });
  }

  protected clearAi(): void {
    this.aiPrompt = '';
    this.aiAnswer = '';
  }

  protected getUserStatusBadgeClass(): string {
    const status = this.currentUser?.userStatus?.value || '';
    if (status === 'ACTIVE') {
      return 'bg-emerald-100 text-emerald-700';
    }

    if (status === 'PENDING_VERIFICATION') {
      return 'bg-amber-100 text-amber-700';
    }

    return 'bg-red-100 text-red-700';
  }

  protected getUserPlanBadgeClass(): string {
    const plan = this.currentUser?.userPlan?.value || '';
    if (plan === 'PREMIUM') {
      return 'bg-indigo-100 text-indigo-700';
    }

    return 'bg-slate-100 text-slate-700';
  }

  private toAiText(response: { message?: string; data?: unknown }): string {
    if (typeof response.data === 'string' && response.data.trim()) {
      return response.data;
    }

    if (response.data) {
      return JSON.stringify(response.data, null, 2);
    }

    return response.message || this.translateService.instant('dashboard.ai.messages.empty');
  }
}
