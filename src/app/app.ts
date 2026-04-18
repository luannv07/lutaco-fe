import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { SHARED_IMPORTS } from './shared/base-imports';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LanguageService } from './core/i18n/language.service';
import { UiLoadingService } from './shared/services/ui-loading.service';
import { filter } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',

  imports: [RouterOutlet, ToastContainerComponent, ...SHARED_IMPORTS],
  templateUrl: './app.html',
  styleUrl: './app.css',
  animations: [
    trigger('screenTransition', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px) scale(0.985)' }),
        animate(
          '220ms cubic-bezier(0.16, 1, 0.3, 1)',
          style({ opacity: 1, transform: 'translateY(0) scale(1)' }),
        ),
      ]),
      transition(':leave', [
        animate(
          '140ms cubic-bezier(0.4, 0, 1, 1)',
          style({ opacity: 0, transform: 'translateY(6px) scale(0.992)' }),
        ),
      ]),
    ]),
  ],
})
export class App {
  isReady = signal(false);
  protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly uiLoading = inject(UiLoadingService);
  protected readonly langService = inject(LanguageService);
  private router = inject(Router);

  constructor() {
    if (!this.isBrowser) {
      return;
    }

    // Chờ router navigate xong lần đầu mới hiện UI
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        take(1),
      )
      .subscribe(() => this.isReady.set(true));
  }
}
