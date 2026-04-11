import { Component, inject, signal } from '@angular/core';
import { SHARED_IMPORTS } from './shared/base-imports';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LanguageService } from './core/i18n/language.service';
import { filter } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',

  imports: [RouterOutlet, ToastContainerComponent, ...SHARED_IMPORTS],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  isReady = signal(false);
  private langService = inject(LanguageService);
  private router = inject(Router);

  constructor() {
    // Chờ router navigate xong lần đầu mới hiện UI
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        take(1),
      )
      .subscribe(() => this.isReady.set(true));
  }
}
