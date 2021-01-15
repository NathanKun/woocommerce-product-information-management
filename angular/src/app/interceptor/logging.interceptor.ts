import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  constructor(private logger: NGXLogger) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const httpMsg = `${request.method} ${request.url}`;
    this.logger.debug(httpMsg);

    return next.handle(request).pipe(
      tap(
        () => this.logger.debug(`Success ${httpMsg}`),
        () => this.logger.debug(`Failed ${httpMsg}`)
      )
    );
  }
}
