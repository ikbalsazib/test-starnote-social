import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule, MatIconModule,
    MatInputModule, MatProgressSpinnerModule, MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatDialogModule
} from '@angular/material';
import {ScrollingModule} from '@angular/cdk/scrolling';




@NgModule({
  declarations: [],
  imports: [
      CommonModule,
      MatButtonModule,
      MatAutocompleteModule,
      MatFormFieldModule,
      MatInputModule,
      MatTableModule,
      MatSortModule,
      MatIconModule,
      MatSelectModule,
      MatProgressSpinnerModule,
      ScrollingModule
  ],
  exports: [
      MatButtonModule,
      MatAutocompleteModule,
      MatFormFieldModule,
      MatInputModule,
      MatTableModule,
      MatSortModule,
      MatDatepickerModule,
      MatIconModule,
      MatSelectModule,
      MatProgressSpinnerModule,
      ScrollingModule
  ]
})
export class AngularMaterialModule { }
