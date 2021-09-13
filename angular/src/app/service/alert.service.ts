import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable({providedIn: 'root'})
export class AlertService {

  constructor(private toastr: ToastrService) {
  }

  success(message: string) {
    this.toastr.success(message, 'Success', {
      timeOut: 3000,
      tapToDismiss: true,
      positionClass: 'toast-top-center'
    })
  }

  error(message: string) {
    this.toastr.error(message, 'Error', {
      timeOut: 3000,
      tapToDismiss: true,
      positionClass: 'toast-top-center'
    })
  }
}
