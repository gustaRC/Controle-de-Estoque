//Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

//PrimeNG
import { CardModule } from 'primeng/card'
import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'
import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api';

//Component
import { AppComponent } from './app.component';
import { HomeComponent } from './modules/home/home.component';
import { CookieService } from 'ngx-cookie-service';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AppFooterComponent } from './app.footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AppFooterComponent,
  ],
  imports: [
    //PrimeNG imports
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule,

    //Angular imports
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    DashboardModule,
  ],
  providers: [
    CookieService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
