import { CustomElementsModule } from './../custom-elements/custom-elements-module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { BannerComponent } from './banner/banner.component';




@NgModule({
  declarations: [
    BreadcrumbsComponent, 
    BannerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BreadcrumbsComponent, 
    BannerComponent
  ]
})
export class SharedComponentsModule { }
