import { ScriptService } from '../shared/services/load-scripts.service';
import { Component, Inject, PLATFORM_ID, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
<% if(auth) { %>
import { AuthService } from 'cap-authorization';
import { StateService } from 'cap-authorization';
<% } %>


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class HeaderComponent implements OnInit {

  constructor(
    <% if(auth) { %>
      public authService: AuthService,
      public stateService: StateService,
    <% } %>
      private scriptService: ScriptService,
      @Inject(PLATFORM_ID) private platformId: string,
      @Inject(DOCUMENT) private document: Document
  ) {

  }

  ngOnInit() {
    this.addMenuScript();
  }

  addMenuScript() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
          this.scriptService.load('webslidemenu').then(data => {
          }).catch(error => console.log(error));
      }, 0);
    }
  }

  // Trick to close menu after options clicked on desktop and movile view
  clickLink() {
      // Close menu in mobile view
      const menu = this.document.getElementById('app');
      if (menu) {
          menu.classList.remove('wsactive');
          // Close Megamenu
          const element = this.document.querySelector('.wsmenu > .wsmenu-list > li:hover > .wsmegamenu');
          if (element) {
              element.classList.add('hidden');
              // Clear style property to return the hover functionality after one second
              setTimeout(function () {
                  element.classList.remove('hidden');
              }, 1000);
          }
      }
  }

}
