import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable({providedIn: 'root'})
export class AlertService {

  private option = {
    timeOut: 3000,
    tapToDismiss: true,
    positionClass: 'toast-top-center',
    progressBar: true
  }

  constructor(private toastr: ToastrService) {
  }

  success(message: string) {
    this.toastr.success(message, 'Success', this.option)
  }

  error(message: string) {
    this.toastr.error(message, 'Error', this.option)
  }
}
