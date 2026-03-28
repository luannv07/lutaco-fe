import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * An array of commonly used modules for standalone components.
 * Import this array and spread it into the 'imports' array of your component
 * to easily include common functionalities.
 */
export const SHARED_IMPORTS = [
  // Angular common modules
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
];
