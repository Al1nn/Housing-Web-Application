import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceAreaFilter'
})
export class PriceAreaFilterPipe implements PipeTransform {
  transform(value: any[], min: number, max: number): any[] {
    if (!value || !min || !max) {
      return value;
    }

    return value.filter(property => {
      return (property.Price >= min && property.Price <= max) || (property.BuiltArea >= min && property.BuiltArea <= max);
    });
  }
}
