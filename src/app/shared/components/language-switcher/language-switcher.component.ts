import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

interface Language {
  code: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.css',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent {
  private translateService = inject(TranslateService);

  languages: Language[] = [
    { code: 'en', label: 'EN', icon: 'fa-solid fa-globe' },
    { code: 'vi', label: 'VI', icon: 'fa-solid fa-globe' },
  ];

  currentLang = signal<string>(this.translateService.currentLang || 'en');
  showDropdown = signal<boolean>(false);

  switchLanguage(langCode: string): void {
    this.translateService.use(langCode);
    this.currentLang.set(langCode);
    this.showDropdown.set(false);
  }

  toggleDropdown(): void {
    this.showDropdown.update((val) => !val);
  }

  closeDropdown(): void {
    this.showDropdown.set(false);
  }

  trackByLang(_index: number, lang: Language): string {
    return lang.code;
  }
}

