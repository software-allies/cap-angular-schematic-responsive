# cap-angular-schematic-responsive  [![NPM version](https://badge.fury.io/js/CAP.svg)](https://npmjs.org/package/CAP) [![Build Status](https://travis-ci.org/Elena%20M.%20Sarabia/CAP.svg?branch=master)](https://travis-ci.org/Elena%20M.%20Sarabia/CAP) [![Generic badge](https://img.shields.io/badge/CAP-Active-<COLOR>.svg)](https://shields.io/)
 This repository is a basic Schematic implementation that serves as a starting point to create and publish Schematics to NPM. 
 
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
* What is the logo url for the header menu? : < logo-url >
* Do you want to remove the content for app.component.html? : < Y/N >
* Do you want integrate with the cap-authentication module? : < Y/N >
* Which service for authentication you choose? : < auth0 / firebase >
* Do you want to add cap-authentication Schematic? : < Y/N >
* Do you want to integrate with cap-sfcore? : < Y/N >

​
The Schematic will create a responsive plate scaffold application with the next features:

- Bootstrap 4.0.0 Wrapper
- Responsive Menu
- Modal Component/Service
- Loading Screen Interceptor/Animation
- Header and Fotter components
- Integration with cap-angular-schematic-auth-auth0 (Autentication menu links)
- Integration with cap-angular-schematic-sfcore (Salesforce Components menu links)

Touched files:

```
app
    |-- footer/
    |-- header/
    |-- home/
	|-- modules/
	|-- app.component.html
    |-- app.module.ts  
    |-- app-routing.module.ts
    |-- angular.json
    |-- package.json
	|-- shared/
	    |-- services/
            |-- load-scripts.service.ts
	        |-- loading-screen.interceptor.ts
	    |-- components/
            |-- cap-components/
                |-- modal/
                    |-- modal.component.ts
                    |-- modal.service.ts
                |-- sa-loading-screen/
                    |-- sa-loading-screen.component.html
                    |-- sa-loading-screen.component.scss
                    |-- sa-loading-screen.component.ts
                    |-- sa-loading-screen.service.ts
            |-- shared-components.module.ts
assets
    |-- js/
        |-- jquery-latest.min.js (95790 bytes)
    |-- webslidemenu
        |-- webslidemenu.css
        |-- webslidemenu.js (6852 bytes)
        |-- color-skins
            |-- white-red.css
        |-- dropdown-effects
            |-- fade-down.css
    |-- images/
        |-- angular-logo.png
```

## Usage
angular 8

## Built With
[Schematic](https://www.schematics.com/)

## Version 
1.0.25

## Authors
Software Allies - [Software Allies](https://github.com/software-allies)
​
### Contributor 
César Alonso Magaña Gavilanes -[cesaralonso](https://github.com/cesaralonso)

## License
MIT © [Software Allies](https://github.com/software-allies/cap-angular-schematic-responsive)