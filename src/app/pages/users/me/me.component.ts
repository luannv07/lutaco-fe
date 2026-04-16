import {
  Component,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../models/user';
import { signal } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { BaseComponent } from '../../../shared/components/base/base.component';

@Component({
  selector: 'app-me',
  standalone: true,
  imports: [CommonModule, CardComponent, BadgeComponent],
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeComponent extends BaseComponent<User> {
  private userService = inject(UserService);

  public user = signal<User | null>(null);
  public isLoading = signal(false);
  public error = signal<string | null>(null);

  protected override service = null as any;

  protected override initForms(): void {
    // No forms needed for profile view
  }

  protected override onBrowserInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.userService.getMySelf().subscribe({
      next: (response) => {
        if (response.data) {
          this.user.set(response.data);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load user information');
        console.error('Error loading user:', error);
        this.isLoading.set(false);
      },
    });
  }
}


