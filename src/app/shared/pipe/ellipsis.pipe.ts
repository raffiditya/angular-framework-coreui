import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipsis'
})
export class EllipsisPipe implements PipeTransform {

  transform(value: string, args: number): any {
    if (!!args && value.length > args) {
      return value.substring(0, args) + '...';
    }

    return value;
  }
}
