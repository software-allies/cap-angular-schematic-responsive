import { Pipe, PipeTransform } from '@angular/core';
 
@Pipe({
    name: 'strReplace'
})
export class StrReplacePipe implements PipeTransform {
 
    public transform(str: any, attribute?: string) {
        if (str === undefined) { return ''; }
        return String(str).replace(/-/g,' ');
    }
}