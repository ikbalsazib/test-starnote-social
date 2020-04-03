import { Pipe, PipeTransform } from '@angular/core';
import {isArray} from 'rxjs/internal-compatibility';

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!isArray(value)) {
      return value;
    }

    return [...value].reverse();
  }

}
