import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DASHBOARD_ROUTES } from './dashboard.routing';
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { SharedModule } from 'src/app/shared/shared.module';

//PrimeNg
import { SidebarModule } from "primeng/sidebar";
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ChartModule } from 'primeng/chart';

//Components
import { DashboardHomeComponent } from './page/dashboard-home/dashboard-home.component';

@NgModule({
  declarations: [
    DashboardHomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(DASHBOARD_ROUTES),
    //PrimeNg
    SidebarModule,
    ButtonModule,
    ToolbarModule,
    CardModule,
    ToastModule,
    ChartModule,
    //Shared
    SharedModule
  ],
  providers: [
    MessageService,
    CookieService,
  ]
})
export class DashboardModule { }
