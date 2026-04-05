import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from './components/button/button.component';
import { InputComponent } from './components/input/input.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { TextareaComponent } from './components/textarea/textarea.component';
import { BadgeComponent } from './components/badge/badge.component';
import { CardComponent } from './components/card/card.component';
import { SelectComponent } from './components/select/select.component';
import { ModalComponent } from './components/modal/modal.component';
import { TableComponent } from './components/table/table.component';

export const SHARED_IMPORTS = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  TranslateModule,
];

export const SHARED_COMPONENTS = [
  ButtonComponent,
  InputComponent,
  CheckboxComponent,
  TextareaComponent,
  BadgeComponent,
  CardComponent,
  SelectComponent,
  ModalComponent,
  TableComponent,
];
