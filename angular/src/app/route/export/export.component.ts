import {AfterViewInit, Component} from '@angular/core';
import {ExportService} from '../../service/export.service';
import {environment} from '../../../environments/environment';
import {AlertService} from '../../service/alert.service';
import {MatDialog} from '@angular/material/dialog';
import {
  ExportCsvChoseCategoriesDialog
} from '../../component/export-csv-chose-categories-dialog/export-csv-chose-categories-dialog.component';
import {CategoryService} from '../../service/category.service';
import {Category} from '../../interface/Category';
import {MiscService} from '../../service/misc.service';
import {ProductService} from '../../service/product.service';
import {Product} from '../../interface/Product';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements AfterViewInit {
  categories: Category[] = []
  incrementalExportSince: string = ''
  productsDeleted: Product[]

  exporting = false;
  exportPdtUrl = `${environment.api}/woo/export-products`
  logs = '';

  constructor(
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private productService: ProductService,
    private exportService: ExportService,
    private miscService: MiscService,
    private alertService: AlertService) {
  }

  ngAfterViewInit() {
    this.categoryService.getCategories(false).subscribe(
      res => {
        this.categories = res
      })

    this.miscService.getMisc('lastProductCsvExport').subscribe(
      res => {
        this.incrementalExportSince = res.value
      }
    )

    this.reloadProductsDeleted()
  }

  reloadProductsDeleted() {
    this.productService.getProductsDeleted().subscribe(
      pdts => {
        this.productsDeleted = pdts
      }
    )
  }

  openExportProductDialog(): void {
    const dialogRef = this.dialog.open(ExportCsvChoseCategoriesDialog, {
      width: '600px',
      data: {categories: this.categories}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        window.open(`${this.exportPdtUrl}?categories=${result}`, '_blank').focus();
      }
    });
  }

  incrementalExportProduct(): void {
    window.open(`${this.exportPdtUrl}?since=${encodeURIComponent(this.incrementalExportSince)}`, '_blank').focus();
  }

  exportCategories() {
    this.exporting = true
    this.exportService.exportCategories().subscribe(this.handleSuccess, this.handleError);
  }

  exportProductAttributes() {
    this.exporting = true
    this.exportService.exportProductAttributes().subscribe(this.handleSuccess, this.handleError);
  }

  findProductsNotExistInPim() {
    this.exporting = true;
    this.productService.findProductsNotExistInPim().subscribe(this.handleSuccess, this.handleError);
  }

  handleSuccess = () => {
    console.log(this)
    this.getLog(true)
  }

  handleError = (error) => {
    this.alertService.error(error)
  }

  getLog(checkAgain: boolean) {
    this.exportService.getLog().subscribe(res => {
      this.logs = res.join('\n')

      if (checkAgain) {
        setTimeout(() => {
          this.exportService.isJobRunning().subscribe(res => {
            this.getLog(res == 'true')
          }, this.handleError);
        }, 1000)
      } else {
        this.exporting = false
      }
    }, this.handleError)
  }

  undeleteProduct(id: number) {
    this.productService.undeleteProduct(id).subscribe(
      () => {
        this.reloadProductsDeleted()
      }
    )
  }
}
