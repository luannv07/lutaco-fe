import {
  Component,
  OnInit,
  signal,
  computed,
  ChangeDetectionStrategy,
  DestroyRef,
  inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SIDEBAR_MENU_CONFIG, MenuItemConfig } from './sidebar.menu.config';
import { AuthService } from '../../../core/services/auth.service';
import { LocalStorageService, LOCAL_STORAGE_KEY } from '../../../core/services/local-storage.service';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { User } from '../../../models/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    TranslateModule,
    FontAwesomeModule,
    LanguageSwitcherComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  private translateService = inject(TranslateService);
  private authService = inject(AuthService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);

  readonly menuItems = signal<MenuItemConfig[]>(SIDEBAR_MENU_CONFIG);
  readonly currentLang = signal<string>('en');
  readonly currentUser = signal<User | null>(null);
  readonly isCollapsed = signal<boolean>(false);

  readonly navigationLabel = computed(() => 'Navigation');
  readonly userDisplayName = computed(() => this.currentUser()?.fullName || this.currentUser()?.username || 'User');
  readonly userRole = computed(() => this.currentUser()?.roleName || 'Member');
  readonly userRoleLabel = computed(() => this.translateService.instant('common.user.role'));
  readonly userName = computed(() => this.currentUser()?.username || 'user');
  readonly userPlanKey = computed(() => (this.currentUser()?.userPlan?.value || 'freemium').toLowerCase());
  readonly isPremium = computed(() => this.userPlanKey() === 'premium');
  readonly isAdmin = computed(() => {
    const roleName = (this.currentUser()?.roleName || '').toUpperCase();
    return roleName === 'ADMIN' || roleName === 'SYS_ADMIN';
  });
  readonly userPlanLabelKey = computed(() =>
    this.isPremium() ? 'common.plan.premium' : 'common.plan.freemium',
  );

  ngOnInit(): void {
    this.currentLang.set(this.translateService.currentLang || 'en');
    this.syncCurrentUser();
    this.restoreSidebarState();
    this.syncSidebarWidth();

    fromEvent(window, 'user-info-updated')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.syncCurrentUser();
      });

    this.translateService.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event: any) => {
        this.currentLang.set(event.lang || this.translateService.currentLang);
        this.syncCurrentUser();
      });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.router.navigate(['/auth/login']);
      },
    });
  }

  goToUpgrade(): void {
    this.router.navigate(['/payment']);
  }

  refreshPage(): void {
    this.document.defaultView?.location.reload();
  }

  toggleCollapse(): void {
    this.isCollapsed.update((value) => !value);
    this.localStorageService.set(LOCAL_STORAGE_KEY.SIDEBAR_COLLAPSED_KEY, this.isCollapsed());
    this.syncSidebarWidth();
  }

  private restoreSidebarState(): void {
    const persistedState = this.localStorageService.get<boolean>(LOCAL_STORAGE_KEY.SIDEBAR_COLLAPSED_KEY);
    if (persistedState === null) return;

    this.isCollapsed.set(Boolean(persistedState));
  }

  private syncSidebarWidth(): void {
    this.document.documentElement.style.setProperty(
      '--sidebar-width',
      this.isCollapsed() ? '5.5rem' : '20rem',
    );
  }

  private syncCurrentUser(): void {
    this.currentUser.set(this.authService.getCurrentUser());
  }

  getMenuItemLabel(item: MenuItemConfig): string {
    return this.translateService.instant(item.translationKey);
  }

  getMenuItemTitle(item: MenuItemConfig): string {
    return this.getMenuItemLabel(item);
  }

  trackByRoute(_index: number, item: MenuItemConfig): string {
    return item.route;
  }
}





