import { ChangeDetectionStrategy, Component, Input, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LanguageService } from '../../../core/i18n/language.service';
import { ToastService } from '../../services/toast.service';

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
export class LanguageSwitcherComponent implements OnInit {
  private translateService = inject(TranslateService);
  private langService = inject(LanguageService);
  private toastService = inject(ToastService);

  @Input() compact = false;

  languages: Language[] = [
    { code: 'en', label: 'EN', icon: 'fa-solid fa-globe' },
    { code: 'vi', label: 'VI', icon: 'fa-solid fa-globe' },
  ];

  currentLang = signal<string>(this.langService.currentLang());

  ngOnInit(): void {
    this.currentLang.set(this.langService.currentLang());
    this.translateService.onLangChange.subscribe(() => {
      this.currentLang.set(this.langService.currentLang());
    });
  }

  toggleLanguage(): void {
    const newLang = this.currentLang() === 'vi' ? 'en' : 'vi';
    this.langService.setLanguage(newLang).then(() => {
      const message = this.translateService.instant('common.messages.languageChanged');
      this.toastService.success(message);
    }).catch((err) => {
      console.error('[LanguageSwitcher] setLanguage error:', err);
    });
  }

  trackByLang(_index: number, lang: Language): string {
    return lang.code;
  }
}

