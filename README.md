# cap-angular-schematic-responsive  [![NPM version](https://badge.fury.io/js/CAP.svg)](https://npmjs.org/package/CAP) [![Build Status](https://travis-ci.org/Elena%20M.%20Sarabia/CAP.svg?branch=master)](https://travis-ci.org/Elena%20M.%20Sarabia/CAP) [![Generic badge](https://img.shields.io/badge/CAP-Active-<COLOR>.svg)](https://shields.io/)
 The Schematic will create a responsive plate scaffold application with many useful features, modules and useful function to start a project.
 

## Prerequisites
* Have an Angular app
* [Node](https://nodejs.org/en/download/current) 10.6 to the current. 

## Installation
To run the schematic, execute the following command.
```
ng add cap-angular-schematic-responsive 
```

The schematic will add an `angular.json` 

```
"styles": [
{
    "input": "./node_modules/bootstrap/dist/css/bootstrap.css"
},
{
    "input": "./src/assets/webslidemenu/dropdown-effects/fade-down.css"
},
{
    "input": "./src/assets/webslidemenu/webslidemenu.scss"
}
],
"scripts": [
{
    "input": "./node_modules/jquery/dist/jquery.min.js"
},
{
    "input": "./node_modules/popper.js/dist/umd/popper.min.js"
},
{
    "input": "./node_modules/bootstrap/dist/js/bootstrap.min.js"
}
]
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
    |-- images/
        |-- angular-logo.png
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
For wait for Web Components are ready are required the next configuration:

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

# SEO Service


## Update Title and Description metas

Use generateTags method of SeoService to update the main SEO metatags.

Example of implementation:

``` 
    import { SeoService } from './../modules/cap-responsive/services/seo.service';

    ...

    constructor(private seoService: SeoService) {}

    ...

    ngOnInit() {
        const tags = {
        title: 'SEO Title text',
        description: 'SEO Description text'
        };
        this.seoService.generateTags(tags);
    }

```

## Facebook and Twitter Share Metas
This schematic put all metas Opengraph and Twitter on index.html.

Use setSocialMediaTags method of SeoService to to update these metatags.

### Metas included on index:

```
  <!-- Facebook metas -->
  <meta property="fb:app_id" content="0123456789876543210">
  <meta property="og:url" content="https://mysite.com">
  <meta property="og:title" content="Page to share title">
  <meta property="og:description" content="Page to share description">
  <meta property="og:image" content="http://mysite.com/assets/image.jpg">
  <meta property="og:image:alt" content="Image description">
  <meta property="og:image:height" content="">
  <meta property="og:image:width" content="">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Mysite.com">

  <!-- Twitter metas -->
  <meta name="twitter:title" content="Page to share title">
  <meta name="twitter:image" content="http://mysite.com/assets/image.jpg">
  <meta name="twitter:image:alt" content="Image description">
  <meta name="twitter:description" content="Page to share description">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:domain" content="mysite.com">
```

### Method Params:

```

    import { SeoService } from './../modules/cap-responsive/services/seo.service';

    ...

    constructor(private seoService: SeoService) {}

    ...

    this.seoService.setSocialMediaTags(
        'https://mysite.com', // url: string, 
        'Page to share title', // title: string, 
        'Page to share description', // description: string, 
        'http://mysite.com/assets/image.jpg', // image: string, 
        'website', // type: string,
        'Mysite.com', // siteNameMeta: string,
        '300', // imageHeigh: string, 
        '500', // imageWidth: string,
        'summary', // twitterCardMeta: string, 
        'mysite.com', // twitterDomainMeta: string
    );
```

## Set Canonical link tag

Use setCanonicalURL method of SeoService to set the canonical url of a page.

Example of implementation:

``` 
    import { SeoService } from './../modules/cap-responsive/services/seo.service';
    import { Router } from '@angular/router';

    ...

    constructor(private seoService: SeoService, private router: Router) {}

    ...

    this.seoService.setCanonicalURL(this.router.url);

```

## Usage
angular 9

## Built With
[Schematic](https://www.schematics.com/)

## Authors
Software Allies - [Software Allies](https://github.com/software-allies)
​
### Contributor 
César Alonso Magaña Gavilanes - [cesaralonso](https://github.com/cesaralonso)

## License
MIT © [Software Allies](https://github.com/software-allies/cap-angular-schematic-responsive)

