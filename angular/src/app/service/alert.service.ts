import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AlertMessage } from '../interface/AlertMessage';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private subject = new Subject<AlertMessage>();

  getAlert(): Observable<AlertMessage> {
    return this.subject.asObservable();
  }

  success(message: string) {
    this.subject.next({ type: 'success', text: message });
  }

  error(message: string) {
    this.subject.next({ type: 'error', text: message });
  }
}
