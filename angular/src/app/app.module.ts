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
import { FlaggedAttributeNameComponent } from './component/flagged-attribute-name/flagged-attribute-name.component';
import {MatGridListModule} from "@angular/material/grid-list";
import { DragDropDirective } from './directive/drag-drop.directive';
import { UploadFileDialog } from './component/upload-file/upload-file-dialog.component';
import {MatMenuModule} from "@angular/material/menu";
import { ImageFieldComponent } from './component/image-field/image-field.component';
import { NgxEditorModule } from 'ngx-editor';
import {ImageSetFieldComponent} from "./component/image-set-field/image-set-field.component";
import { RichTextFieldComponent } from './component/rich-text-field/rich-text-field.component';
import { RichTextFieldDialog } from './component/rich-text-field-dialog/rich-text-field-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    DateTimeFormatPipe,
    SettingsComponent,
    HomeComponent,
    CategoriesComponent,
    CategorySideItemComponent,
    FlaggedAttributeNameComponent,
    DragDropDirective,
    UploadFileDialog,
    ImageFieldComponent,
    ImageSetFieldComponent,
    RichTextFieldComponent,
    RichTextFieldDialog,
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
    MatGridListModule,
    MatMenuModule,
    MatSelectModule,
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
    NgxEditorModule.forRoot({
      locals: {
        // menu
        bold: 'Bold',
        italic: 'Italic',
        code: 'Code',
        blockquote: 'Blockquote',
        underline: 'Underline',
        strike: 'Strike',
        bullet_list: 'Bullet List',
        ordered_list: 'Ordered List',
        heading: 'Heading',
        h1: 'Header 1',
        h2: 'Header 2',
        h3: 'Header 3',
        h4: 'Header 4',
        h5: 'Header 5',
        h6: 'Header 6',
        align_left: 'Left Align',
        align_center: 'Center Align',
        align_right: 'Right Align',
        align_justify: 'Justify',
        text_color: 'Text Color',
        background_color: 'Background Color',

        // popups, forms, others...
        url: 'URL',
        text: 'Text',
        openInNewTab: 'Open in new tab',
        insert: 'Insert',
        altText: 'Alt Text',
        title: 'Title',
        remove: 'Remove',
      },
    }),
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
