import { CapResponsiveModule } from './../modules/cap-responsive/cap-responsive.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [ 
    HomeComponent
  ],
  imports: [
    CommonModule,
    CapResponsiveModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class HomeModule { }
