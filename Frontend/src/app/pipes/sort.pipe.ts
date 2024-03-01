import { Pipe, PipeTransform } from '@angular/core';
/*
  pricePerSqr = price / sqrArea
  Sortare dupa pricePerSqr, dar fara sa contina var. auxiliara
  argumente de la metoda de sortare, price , sqrArea

  //Adaugare in combobox

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

        if (sortField === 'Price Per Area') {
            return value.sort((a: any, b: any) => {
                if (a['price'] / a['builtArea'] < b['price'] / b['builtArea']) {
                    return -1 * multiplier;
                } else if (a['Price'] / a['BuiltArea'] > b['Price'] / b['BuiltArea']) {
                    return 1 * multiplier;
                } else {
                    return 0;
                }
            });
        }


        return value.sort((a: any, b: any) => {
            if (a[sortField] < b[sortField]) {
                return -1 * multiplier;
            } else if (a[sortField] > b[sortField]) {
                return 1 * multiplier;
            } else {
                return 0;
            }
        });



    }


}
