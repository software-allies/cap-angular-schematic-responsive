import { Injectable, Inject, PLATFORM_ID, Injector, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';


@Injectable({
    providedIn: 'root'
})
export class CommonService {

    constructor(
        private router: Router,
        private injector: Injector,
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: string,
        private ngZone: NgZone) {
        }


    capitalize(str: string): string {
        return str
          .toLowerCase()
          .split(' ')
          .map(function(word) {
              if (word.trim().length) {
                return word[0].toUpperCase() + word.substr(1);
              } else {
                return '';
              }
          })
          .join(' ');
    }

    toEntero(_string: string): number {
        return +_string;
    }

    decodeURI(_string: string): string {
        let uri = _string
            .replace(/-/g, ' ')
            .replace(/ooo/g, "'");

        return String(uri).toLowerCase();
    }

    encodeURI(_string: string): string {
        let uri = _string
            .replace(/&/g, 'and')
            .replace(/\//g, '-')
            .replace(/[’':?!@%^*()_+]/g, '');
        uri = uri.split(' ')
            .join('-');

        return encodeURIComponent(String(uri)).toLowerCase();
    }

    scrollTop() {
        this.document.body.scrollTop = 0; // For Safari
        this.document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    goToRoute(link: string): void {
        this.ngZone.run(() => {
          this.router.navigate([link]);
        });
    }

    generateRandomString() {
      const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      return key.substring(0, 8) + key.substring(8, 12) + key.substring(12, 16) + key.substring(16, 20);
    }

}
