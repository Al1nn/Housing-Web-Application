import { Pipe, PipeTransform } from '@angular/core';
/*
  Pe search trebuie facut cu contain oriunde s-ar afla
  search pe Type, Name si Location


  Pe search de asemenea trebuie un filtru pentru price si area (Select)
  care sa contina valori min - max, acesta trebuie sa arate proprietatile interval.
*/
@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(value: any[], filterString: string, propNames: string[]): any[] {
  if (
    !value ||
    value.length === 0 ||
    !filterString ||
    filterString.length === 0 ||
    !propNames ||
    propNames.length === 0
  ) {
    return value;
  }


  return value.filter((item) => {
    return propNames.some((propName) => {
      if (item[propName] && item[propName].toLowerCase().includes(filterString.toLowerCase())) {
        return true;
      }
      return false;
    });
  });
}
}
