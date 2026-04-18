import {
  Component,
  OnInit,
  signal,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SIDEBAR_MENU_CONFIG, MenuItemConfig } from './sidebar.menu.config';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

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

  menuItems = signal<MenuItemConfig[]>(SIDEBAR_MENU_CONFIG);
  currentLang = signal<string>('en');

  ngOnInit(): void {
    this.currentLang.set(this.translateService.currentLang || 'en');
    this.translateService.onLangChange.subscribe((event: any) => {
      this.currentLang.set(event.lang || this.translateService.currentLang);
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        // Navigation happens in auth service or guard
      },
      error: () => {
        // Error is handled in auth service
      },
    });
  }

  getMenuItemLabel(item: MenuItemConfig): string {
    return this.translateService.instant(item.translationKey);
  }

  trackByRoute(_index: number, item: MenuItemConfig): string {
    return item.route;
  }
}





