import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root',
})
export class PwaUpdateService {
  constructor(private swUpdate: SwUpdate, private snackbar: MatSnackBar) {}

  public subscribeAvailable() {
    this.swUpdate.available.subscribe((evt) => {
      this.snackbar
        .open('Update Available', 'Reload')
        .onAction()
        .subscribe(() => {
          window.location.reload();
        });
    });
  }
}
