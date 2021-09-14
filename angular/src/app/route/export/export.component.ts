import {Component} from '@angular/core';
import {ExportService} from '../../service/export.service';
import {environment} from '../../../environments/environment';
import {AlertService} from '../../service/alert.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent {

  exporting = false;
  exportPdtUrl = `${environment.api}/woo/export-products`
  logs = '';

  constructor(
    private exportService: ExportService,
    private alertService: AlertService) {
  }

  exportCategories() {
    this.exporting = true
    this.exportService.exportCategories().subscribe(this.handleSuccess, this.handleError);
  }

  exportProductAttributes() {
    this.exporting = true
    this.exportService.exportProductAttributes().subscribe(this.handleSuccess, this.handleError);
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
}
