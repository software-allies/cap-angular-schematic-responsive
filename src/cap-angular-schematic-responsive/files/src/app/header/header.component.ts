import { Component, Inject, PLATFORM_ID, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { ModalService } from '../modules/cap-responsive/components/modal/modal.service';
import { LoadScriptService } from '../modules/cap-responsive/services/load-scripts.service';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd, Event } from '@angular/router';
<% if(auth && authService === 'auth0') { %>
import { AuthenticationService } from 'cap-authentication';
import { StateService } from 'cap-authentication';
<% } %>
<% if(auth && authService === 'firebase') { %>
import { AuthenticationService } from 'cap-authentication-firebase';
import { StateService } from 'cap-authentication-firebase';
<% } %>


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class HeaderComponent implements OnInit {

  routerSubscription: Subscription;
  isTheHome = true;


  constructor (
    <% if(auth) { %>
      public authenticationService: AuthenticationService,
      public stateService: StateService,
    <% } %>
      private scriptService: LoadScriptService,
      @Inject(PLATFORM_ID) private platformId: string,
      @Inject(DOCUMENT) private document: Document,
      public modalService: ModalService,
      private router: Router
  ) {
      
    // Check if the route is the root for set the dark menu style
    this.routerSubscription = router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.url;
        this.isTheHome = this.commonService.isTheHome = (event.url === '/' || event.url === '/newsletter-sign-up' || event.url === '/artwork-form')
      }
    });
  }

  ngOnInit() {
    this.addMenuScript();
  }
  
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
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
