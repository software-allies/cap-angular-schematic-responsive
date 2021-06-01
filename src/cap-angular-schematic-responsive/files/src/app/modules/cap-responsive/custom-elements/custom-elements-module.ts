import { Router, RouterModule } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ImgLazyComponent } from './img-lazy/img-lazy.component';
  
  

@NgModule({
    declarations: [
        ImgLazyComponent
    ],
    entryComponents: [
        ImgLazyComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
    providers: [
    ]
})
export class CustomElementsModule { }
