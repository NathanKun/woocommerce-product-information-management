import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SettingsComponent} from './route/settings/settings.component';
import {HomeComponent} from './route/home/home.component';
import {CategoriesComponent} from './route/categories/categories.component';
import {ProductsComponent} from './route/products/products.component';
import {ExportComponent} from './route/export/export.component';
import {VariationAttributesComponent} from './route/variation-attributes/variation-attributes.component';

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
    path: 'variation-attributes',
    component: VariationAttributesComponent,
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
    path: 'export',
    component: ExportComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
