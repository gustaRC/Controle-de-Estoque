import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';

//PrimeNg
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { ToolbarNavigationComponent } from './components/toolbar-navigation/toolbar-navigation.component';
import { ReduzirTextoPipe } from './pipes/reduzir-texto.pipe';


@NgModule({
  declarations: [
    ToolbarNavigationComponent,
    ReduzirTextoPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    //PrimeNg
    ButtonModule,
    ToolbarModule,
    CardModule,
  ],
  exports: [
    ToolbarNavigationComponent,
    ReduzirTextoPipe
  ],
  providers: [
    DialogService,
    CurrencyPipe
  ]
})
export class SharedModule { }
