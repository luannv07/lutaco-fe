import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // Import FontAwesomeModule

// Import shared components
import { ButtonComponent } from './components/button/button.component';
import { InputComponent } from './components/input/input.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { TextareaComponent } from './components/textarea/textarea.component';

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
  FontAwesomeModule, // Add FontAwesomeModule

  // Add your own shared standalone components, directives, or pipes here
  ButtonComponent, // Add ButtonComponent
  InputComponent, // Add InputComponent
  CheckboxComponent, // Add CheckboxComponent
  TextareaComponent, // Add TextareaComponent
];
