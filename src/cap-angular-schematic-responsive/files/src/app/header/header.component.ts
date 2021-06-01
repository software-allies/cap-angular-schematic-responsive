import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ModalService } from '../modules/cap-responsive/components/modal/modal.service';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd, Event } from '@angular/router';
<% if (auth && authService === 'auth0') { %>
import { AuthenticationService } from 'cap-authentication';
import { StateService } from 'cap-authentication';
<% } %>
<% if (auth && authService === 'firebase') { %>
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
  
  constructor(
    <% if (auth) { %>
    public authenticationService: AuthenticationService,
    public stateService: StateService,
    <% } %>
    public modalService: ModalService,
    private router: Router
  ) {
    let scrolling = false;
    window.onscroll = function () { scrolling = true };

    setInterval(() => {
      if (scrolling) {
        scrolling = false;
        let navbar = document.getElementById("navbar");
        if (window.pageYOffset === 0) {
          navbar.style.backgroundColor = '';
        } else {
          navbar.style.backgroundColor = '#080808';
          navbar.style.transition = 'all .2s ease-in-out';
        }
      }
    }, 100);

    this.routerSubscription = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/' || event.url === '/home') {
          const header = document.querySelector('#header') as HTMLElement;
          header.style.height = "50vh";
          const headerTitle = document.querySelector('#header__text-box') as HTMLElement;
          headerTitle.style.display = "block";
        } else {
          const header = document.querySelector('#header') as HTMLElement;
          header.style.height = "10vh";
          const headerTitle = document.querySelector('#header__text-box') as HTMLElement;
          headerTitle.style.display = "none";
        }
      }
  });
}

  ngOnInit() { }

  openMenu() {
    //Declaring the variables to get the HTML elements by ID
    let navigationList = document.getElementById("list-menu") as HTMLElement;
    let handlerMenu = document.getElementById("menu-handler") as HTMLElement;
    let openIcon = document.getElementById("open") as HTMLElement;
    let cancelIcon = document.getElementById("cancel") as HTMLElement;

    console.log(navigationList.style.getPropertyValue('transition') === '');

    navigationList.style.getPropertyValue('transition') === '' ? navigationList.style.transition = 'all 1s ease-in-out' : console.log('gg')
    if (navigationList.style.left === '-30rem' || navigationList.style.getPropertyValue('left') === '') {
      navigationList.style.transition = 'transition: all 1s ease-in-out';
      openIcon.style.display = 'none';
      cancelIcon.style.display = 'flex';
      navigationList.style.left = '0rem';
      handlerMenu.style.left = '21rem';
    } else {
      navigationList.style.left = '-30rem';
      handlerMenu.style.left = '0rem';
      cancelIcon.style.display = 'none';
      openIcon.style.display = 'flex';
      navigationList.style.transition = 'transition: all 1s ease-in-out';
    }
  }
}
