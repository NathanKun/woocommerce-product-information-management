import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoggerModule } from 'ngx-logger';
import { AlertComponent } from './component/alert/alert.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { CredentialsInterceptor } from './interceptor/credentials.interceptor';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './route-reuse-strategy';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateTimeFormatPipe } from './pipe/date-time-format-pipe.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTreeModule } from '@angular/material/tree';
import { SettingsComponent } from './route/settings/settings.component';
import { HomeComponent } from './route/home/home.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSelectModule} from "@angular/material/select";
import { CategoriesComponent } from './route/categories/categories.component';
import { CategorySideItemComponent } from './component/category-side-item/category-side-item.component';
import { FlagedAttributeNameComponent } from './component/flaged-attribute-name/flaged-attribute-name.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    DateTimeFormatPipe,
    SettingsComponent,
    HomeComponent,
    CategoriesComponent,
    CategorySideItemComponent,
    FlagedAttributeNameComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatSidenavModule,
    MatButtonToggleModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatTreeModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    LoggerModule.forRoot({
      // serverLoggingUrl: '/api/logs',
      // serverLogLevel: NgxLoggerLevel.ERROR,
      level: environment.loggerLevel,
    }),
    MatSelectModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggingInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CredentialsInterceptor,
      multi: true,
    },
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy,
    },
    DateTimeFormatPipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
