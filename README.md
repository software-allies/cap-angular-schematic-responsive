# cap-angular-schematic-responsive  [![NPM version](https://badge.fury.io/js/CAP.svg)](https://npmjs.org/package/CAP) [![Build Status](https://travis-ci.org/Elena%20M.%20Sarabia/CAP.svg?branch=master)](https://travis-ci.org/Elena%20M.%20Sarabia/CAP) [![Generic badge](https://img.shields.io/badge/CAP-Active-<COLOR>.svg)](https://shields.io/)
 The Schematic will create a responsive plate scaffold application with many useful features, modules and useful function to starta project.
 
# Getting Started
 These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Prerequisites
* Have an Angular app 
install  npm 6.13.7 
```	
nmp install 
```
* [Node](https://nodejs.org/en/download/current) 10.6 to the current. 


## Installation
To run the schematic, execute the following command.
```
ng add cap-angular-schematic-responsive 
```

The schematic will add an `angular.json` 

```
"styles": [
"src/styles.scss",
{
"input": "./node_modules/bootstrap/dist/css/bootstrap.css"
},
{
"input": "./src/assets/webslidemenu/dropdown-effects/fade-down.css"
},
{
"input": "./src/assets/webslidemenu/webslidemenu.css"
}
], 
```
The schematic will be configurated after you answer the following questions.

* What is the project title for the App? : < string >
* Do you want to remove the content for app.component.html? : < Y/N >
* Would you like to add cap-authentication functionallity to the menu? : < Y/N >
* Which service for authentication you choose? : < auth0 / firebase >
* Do you want to add cap-authentication Schematic? : < Y/N >
* Do you want to integrate with cap-sfcore module?? : < Y/N >

​
The Schematic will create a responsive plate scaffold application with the next features:

- Bootstrap 4.0.0 Wrapper.
- Responsive Menu.
- Modal Component/Service.
- Loading Screen Interceptor/Animation.
- SEO metatags service.
- REST API request service.
- Cache Request Interceptor.
- Header and Fotter components.
- Integration with cap-angular-schematic-auth-auth0 (Autentication menu links).
- Integration with cap-angular-schematic-sfcore (Salesforce Components menu links).
- Pipes for url encode and string decode.
- Common Service with useful common functions.
- Banner and Breadcrumbs components.
- Custom Elememnts implementation, a image lazy defer screen custom element included.

Touched files:

```
app
    |-- footer/
        |-- footer.component.html
        |-- footer.component.scss
        |-- footer.component.ts
    |-- header/
        |-- header.component.html
        |-- header.component.scss
        |-- header.component.ts
    |-- home/
        |-- home.component.html
        |-- home.component.scss
        |-- home.component.ts
        |-- home.module.ts
	|-- app.component.html
    |-- app.module.ts  
    |-- app-routing.module.ts
    |-- angular.json
    |-- package.json
    |-- modules/
        |-- cap-responsive/
            |-- services/
                |-- load-scripts.service.ts
                |-- loading-screen.interceptor.ts
                |-- seo-service.ts
                |-- api.service.ts
                |-- cache.interceptor.ts
                |-- common.service.ts
            |-- custom-elements/
            |-- components/
                |-- banner/
                |-- breadcrumbs/
                |-- modal/
                    |-- modal.component.ts
                    |-- modal.service.ts
                |-- loading-screen/
                    |-- loading-screen.component.html
                    |-- loading-screen.component.scss
                    |-- loading-screen.component.ts
                    |-- loading-screen.service.ts
            |-- pipes/
                    |-- encode-uri.pipe.ts
                    |-- str-decode.pipe.ts
            |-- cap-responsive.module.ts
assets
    |-- images/
        |-- angular-logo.png
    |-- webslidemenu/
        |-- webslidemenu.scss
        |-- webslidemenu.js
        |-- color-skins/
            |-- white-red.css
        |-- dropdown-effects/
            |-- fade-down.css
```


## How implement Banner Component
```
<app-banner [title]="'Connected Apps Plattform'" [background]="'https://ep01.epimg.net/elpais/imagenes/2019/10/30/album/1572424649_614672_1572453030_noticia_normal.jpg'"></app-banner>
     
```

## How implement Breadcrumbs Component
```
<app-breadcrumbs [links]="{home: '/', publications: '/publications'}"></app-breadcrumbs>
     
```


# Custom Elements

## How to register img-lazy component as a custom element
This custom element is useful to increment the Performance of a application because use the defer offscreen hability, is compatible with SSR and very useful for SEO, the images are wrapped in a figure element and the description in a figure-caption element also.

* In a SSR application:


```
import { ImgLazyComponent } from './modules/cap-responsive/custom-elements/img-lazy/img-lazy.component';
import { PLATFORM_ID, Inject, Injector } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
...

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private injector: Injector,
    @Inject(PLATFORM_ID) private platformId: string) {
      const { createCustomElement } = require('@angular/elements');
      if (isPlatformBrowser(this.platformId)) {
        // Register Custom Elements and Web Components
        const elements: any[] = [
          [ImgLazyComponent, 'img-lazy-element']
        ];        
        for (const [component, name] of elements) {
          const el = createCustomElement(component, { injector: this.injector });
          customElements.define(name, el);
        }
    }
  }
}

```

* In a non SSR aplication:

```
import { ImgLazyComponent } from './modules/cap-responsive/custom-elements/img-lazy/img-lazy.component';
import { createCustomElement } from '@angular/elements';
...

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() {
    // Register Custom Elements and Web Components
    const elements: any[] = [
        [ImgLazyComponent, 'img-lazy-element']
    ];        
    for (const [component, name] of elements) {
        const el = createCustomElement(component, { injector: this.injector });
        customElements.define(name, el);
    }
  }
}

```

## Update the main.ts file
For wait for Web Components are ready are neccesary the next configuration:

```
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


declare global {
  interface Window {
    WebComponents: {
      ready: boolean;
    };
  }
}

if (environment.production) {
  enableProdMode();
}

function bootstrapModule() {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.WebComponents.ready) {
    // Web Components are ready
    bootstrapModule();
  } else {
    // Wait for polyfills to load
    window.addEventListener('WebComponentsReady', bootstrapModule);
  }
});

```

## How implement img-lazy-element in a template
```
  <div class="row">
      <div class="col-lg-3 col-md-4 col-6" *ngFor="let item of items">
          <a routerLink="/items/{{item.id}}" title="{{item.name}}">
              <img-lazy-element [src]="item.logo.file.url" [alt]="item.logo.file.title"></img-lazy-element>
          </a>
      </div>
  </div>
```



## Usage
angular 9

## Built With
[Schematic](https://www.schematics.com/)

## Version 
1.1.5

## Authors
Software Allies - [Software Allies](https://github.com/software-allies)
​
### Contributor 
César Alonso Magaña Gavilanes - [cesaralonso](https://github.com/cesaralonso)

## License
MIT © [Software Allies](https://github.com/software-allies/cap-angular-schematic-responsive)

