import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoggerModule} from 'ngx-logger';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {LoggingInterceptor} from './interceptor/logging.interceptor';
import {CredentialsInterceptor} from './interceptor/credentials.interceptor';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {RouteReuseStrategy} from '@angular/router';
import {CustomRouteReuseStrategy} from './route-reuse-strategy';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {DateTimeFormatPipe} from './pipe/date-time-format-pipe.pipe';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTreeModule} from '@angular/material/tree';
import {SettingsComponent} from './route/settings/settings.component';
import {HomeComponent} from './route/home/home.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import {CategoriesComponent} from './route/categories/categories.component';
import {CategorySideItemComponent} from './component/category-side-item/category-side-item.component';
import {FlaggedAttributeNameComponent} from './component/flagged-attribute-name/flagged-attribute-name.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {DragDropDirective} from './directive/drag-drop.directive';
import {UploadFileDialogComponent} from './component/upload-file/upload-file-dialog.component';
import {MatMenuModule} from '@angular/material/menu';
import {ImageFieldComponent} from './component/image-field/image-field.component';
import {NgxEditorModule} from 'ngx-editor';
import {ImageSetFieldComponent} from './component/image-set-field/image-set-field.component';
import {RichTextFieldComponent} from './component/rich-text-field/rich-text-field.component';
import {RichTextFieldDialog} from './component/rich-text-field-dialog/rich-text-field-dialog.component';
import {NgxEditorImageWithUploadComponent} from './component/ngx-editor-image-with-upload/ngx-editor-image-with-upload.component';
import {SanitizeHtmlPipe} from './pipe/sanitize-html-pipe.pipe';
import {BooleanFieldComponent} from './component/boolean-field/boolean-field.component';
import {CategorySelectFieldComponent} from './component/category-select-field/category-select-field.component';
import {ProductsComponent} from './route/products/products.component';
import {ProductSideItemComponent} from './component/product-side-item/product-side-item.component';
import {ProductTypeFieldComponent} from './component/product-type-field/product-type-field.component';
import {SelectFieldComponent} from './component/select-field/select-field.component';
import {TextFieldComponent} from './component/text-field/text-field.component';
import {NumberFieldComponent} from './component/number-field/number-field.component';
import {DatetimePickerFieldComponent} from './component/datetime-picker-field/datetime-picker-field.component';
import {NgxMatDatetimePickerModule} from '@angular-material-components/datetime-picker';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgxMatMomentModule} from '@angular-material-components/moment-adapter';
import {ExportComponent} from './route/export/export.component';
import {VariationAttributesComponent} from './route/variation-attributes/variation-attributes.component';
import {ToastrModule} from 'ngx-toastr';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {StockComponent} from './route/stock/stock.component';
import {NgxBarCodePutModule} from 'ngx-barcodeput';
import { ExportCsvChoseCategoriesDialog } from './component/export-csv-chose-categories-dialog/export-csv-chose-categories-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    DateTimeFormatPipe,
    SanitizeHtmlPipe,
    SettingsComponent,
    HomeComponent,
    CategoriesComponent,
    CategorySideItemComponent,
    ProductSideItemComponent,
    FlaggedAttributeNameComponent,
    DragDropDirective,
    UploadFileDialogComponent,
    ImageFieldComponent,
    ImageSetFieldComponent,
    RichTextFieldComponent,
    RichTextFieldDialog,
    NgxEditorImageWithUploadComponent,
    BooleanFieldComponent,
    CategorySelectFieldComponent,
    ProductsComponent,
    ProductTypeFieldComponent,
    SelectFieldComponent,
    TextFieldComponent,
    NumberFieldComponent,
    DatetimePickerFieldComponent,
    ExportComponent,
    VariationAttributesComponent,
    StockComponent,
    ExportCsvChoseCategoriesDialog,
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
    MatDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMatDatetimePickerModule,
    NgxMatMomentModule,
    NgxBarCodePutModule,
    BrowserAnimationsModule, // Toastr Module required animations module
    ToastrModule.forRoot(), // Toastr Module
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
    MatChipsModule,
    MatAutocompleteModule,
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
    SanitizeHtmlPipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
