import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * An array of commonly used modules and components for standalone components.
 * Import this array and spread it into the 'imports' array of your component
 * to easily include common functionalities.
 *
 * @example
 * import { Component } from '@angular/core';
 * import { SHARED_IMPORTS } from '../shared/base-imports';
 *
 * @Component({
 *   selector: 'app-my-component',
 *   standalone: true,
 *   imports: [
 *     ...SHARED_IMPORTS
 *     // ... other component-specific imports
 *   ],
 *   template: `<div *ngIf="true">Hello</div>`,
 * })
 * export class MyComponent {}
 */
export const SHARED_IMPORTS = [
  // Angular common modules
  CommonModule,
  FormsModule,
  ReactiveFormsModule,

  // Add your own shared standalone components, directives, or pipes here
  // Example:
  // MySharedComponent,
  // MySharedPipe,
];
