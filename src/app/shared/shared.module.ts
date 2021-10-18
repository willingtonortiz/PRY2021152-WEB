import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { ConfirmationDialogComponent } from './presentation';

const MATERIAL_MODULES = [
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatTableModule,
  MatIconModule,
  MatSelectModule,
  MatSnackBarModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatSidenavModule,
  LayoutModule,
  MatSlideToggleModule,
];

const SHARED_COMPONENTS = [ConfirmationDialogComponent];

@NgModule({
  imports: [CommonModule, ...MATERIAL_MODULES],
  declarations: [...SHARED_COMPONENTS],
  exports: [...MATERIAL_MODULES, ...SHARED_COMPONENTS],
})
export class SharedModule {}
