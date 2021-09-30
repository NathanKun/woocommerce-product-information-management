import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable({providedIn: 'root'})
export class AlertService {

  private optionNormal = {
    timeOut: 3000,
    tapToDismiss: true,
    positionClass: 'toast-top-center',
    progressBar: true
  }

  private optionLoading = {
    timeOut: 0,
    extendedTimeOut: 0,
    tapToDismiss: true,
    positionClass: 'toast-top-center',
    progressBar: true
  }

  constructor(private toastr: ToastrService) {
  }

  success(message: string): number {
    return this.toastr.success(message, 'Success', this.optionNormal).toastId
  }

  error(message: string): number {
    return this.toastr.error(message, 'Error', this.optionNormal).toastId
  }

  loading(): number {
    return this.toastr.info('Please wait', 'Loading', this.optionLoading).toastId
  }

  // Remove current using animation
  clear(id: number) {
    this.toastr.clear(id)
  }

  // Immediately remove toasts without using animation
  remove(id: number) {
    this.toastr.remove(id)
  }
}
