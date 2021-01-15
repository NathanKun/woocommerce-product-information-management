import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateTimeFormat',
})
// eslint-disable-next-line @angular-eslint/use-pipe-transform-interface
export class DateTimeFormatPipe extends DatePipe {
  constructor() {
    super('en-US');
  }

  transform(value: Date, ...args: unknown[]): any {
    return super.transform(value, 'yyyy/MM/dd HH:mm:ss');
  }
}
