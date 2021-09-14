import {Component} from '@angular/core';
import {ExportService} from '../../service/export.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent {

  exporting = false;
  exportPdtUrl = `${environment.api}/woo/export-products`
  logs = '';

  constructor(private exportService: ExportService) {
  }

  exportCategories() {
    this.exporting = true
    this.exportService.exportCategories().subscribe(this.handleSuccess, this.handleError);
  }

  exportProductAttributes() {
    this.exporting = true
    this.exportService.exportProductAttributes().subscribe(this.handleSuccess, this.handleError);
  }

  handleSuccess(res: string) {
    this.exporting = false;
    this.logs = res;
  }

  handleError(error) {
    this.exporting = false;
    this.logs = JSON.stringify(decodeURIComponent(error), undefined, 2);
  }
}
