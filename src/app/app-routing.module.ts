import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { DashboardHomeComponent } from './modules/dashboard/page/dashboard-home/dashboard-home.component';
import { AutenticarGuard } from './guards/autenticar-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AutenticarGuard],
  },
  {
    path: 'products',
    loadChildren: () => import('./modules/products/products.module').then((m) => m.ProductsModule),
    canActivate: [AutenticarGuard],
  },
  {
    path: 'categories',
    loadChildren: () => import('./modules/categories/categories.module').then((m) => m.CategoriesModule),
    canActivate: [AutenticarGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
