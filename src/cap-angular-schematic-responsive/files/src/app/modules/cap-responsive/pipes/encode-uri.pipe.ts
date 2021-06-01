import { Pipe, PipeTransform } from '@angular/core';
 
@Pipe({
    name: 'encodeURI'
})
export class EncodeURIPipe implements PipeTransform {
 
    public transform(uri: any, attribute?: string) {
    if (uri === undefined) { return ''; }
      uri = uri.replace(/&/g, 'and').replace(/\//g, '-').replace(/[’':?!@%^*()_+]/g, '')
      uri = uri.split(' ').join('-')
      return encodeURIComponent(String(uri)).toLowerCase();
    }
}