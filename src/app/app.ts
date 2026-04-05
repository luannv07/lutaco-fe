import { Component } from '@angular/core';
import { SHARED_IMPORTS } from './shared/base-imports';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent, ...SHARED_IMPORTS],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
