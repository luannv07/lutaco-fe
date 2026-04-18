import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_COMPONENTS, SHARED_IMPORTS } from '../../shared/base-imports';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [...SHARED_IMPORTS, ...SHARED_COMPONENTS],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {}
