import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
    transform(value: string, input: string): string {
        if (!input || !value) {
            return value;
        }

        const escapedInput = input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp('(' + escapedInput + ')', 'gi');

        return value.replace(regex, '<strong>$1</strong>');
    }
}
