import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SettingsComponent} from "./route/settings/settings.component";
import {HomeComponent} from "./route/home/home.component";
import {CategoriesComponent} from "./route/categories/categories.component";
import {ProductsComponent} from "./route/products/products.component";

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'categories',
    component: CategoriesComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'processes',
    component: SettingsComponent,
  },
  {
    path: 'feedbacks',
    component: SettingsComponent,
  },
  {
    path: 'facebook',
    component: SettingsComponent,
  },
  {
    path: 'evernote',
    component: SettingsComponent,
  },
  {
    path: 'yinxiang',
    component: SettingsComponent,
  },
  {
    path: 'activities',
    component: SettingsComponent,
  },
  {
    path: 'latest-activities',
    component: SettingsComponent,
  },
  {
    path: 'files',
    component: SettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
