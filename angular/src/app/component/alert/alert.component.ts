import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from '../../service/alert.service';
import { AlertMessage } from '../../interface/AlertMessage';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-alert',
  templateUrl: 'alert.component.html',
})
export class AlertComponent implements OnInit, OnDestroy {
  messages: AlertMessage[] = [];
  private subscription: Subscription;

  constructor(private alertService: AlertService, private logger: NGXLogger) {}

  ngOnInit() {
    this.subscription = this.alertService
      .getAlert()
      .subscribe((message: AlertMessage) => {
        this.logger.debug('AlertComponent: Received alert: ' + message.text);

        switch (message && message.type) {
          case 'success':
            message.cssClass = 'alert alert-success';
            break;
          case 'error':
            message.cssClass = 'alert alert-danger';
            break;
        }

        this.messages.push(message);
        this.logger.debug(this.messages);

        setTimeout(() => {
          this.messages = this.messages.filter((obj) => obj != message);
        }, 500000);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
