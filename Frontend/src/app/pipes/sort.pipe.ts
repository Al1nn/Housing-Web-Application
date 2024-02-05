import { Pipe, PipeTransform } from '@angular/core';
/*
  pricePerSqr = price / sqrArea
  Sortare dupa pricePerSqr, dar fara sa contina var. auxiliara
  argumente de la metoda de sortare, price , sqrArea
*/
@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(value: Array<string> | undefined, args: any[]): any {
    if (!value) {
      return value;
    }

    const sortField = args[0];
    const sortDirection = args[1];


    const multiplier = sortDirection === 'desc' ? -1 : 1;

    return value.sort((a: any, b: any) => {


      if (a[sortField] < b[sortField] ) {
        return -1 * multiplier;
      } else if (a[sortField] > b[sortField] ) {
        return 1 * multiplier;
      } else {
        return 0;
      }
    });
  }


}
