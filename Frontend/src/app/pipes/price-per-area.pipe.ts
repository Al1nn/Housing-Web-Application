import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pricePerAreaSort'
})
export class PricePerAreaPipe implements PipeTransform {

  transform(value: any, pricePerArea : number): any {


    if(!value  || pricePerArea === 0){
      return value;
    }

    return value.sort( (a: any, b:any) => {

      return Math.abs( ( a['Price'] / a['BuiltArea']) - pricePerArea )
      - Math.abs( ( b['Price'] / b['BuiltArea']) - pricePerArea );
    });
  }

}
