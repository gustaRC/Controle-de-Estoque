import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

//PrimeNg
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogService, DynamicDialogModule, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';

import { PRODUCTS_ROUTES } from './products.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductsHomeComponent } from './products-home/products-home.component';
import { ProductsTableComponent } from './components/products-table/products-table.component';
import { ProductFormComponent } from './components/product-form/product-form.component';

@NgModule({
  declarations: [
    ProductsHomeComponent,
    ProductsTableComponent,
    ProductFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(PRODUCTS_ROUTES),
    HttpClientModule,
    //PrimeNg
    CardModule,
    ButtonModule,
    TableModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    DynamicDialogModule,
    DropdownModule,
    ConfirmDialogModule,
    TooltipModule,

  ],
  providers: [
    DialogService,
    ConfirmationService,
  ],
})
export class ProductsModule { }
