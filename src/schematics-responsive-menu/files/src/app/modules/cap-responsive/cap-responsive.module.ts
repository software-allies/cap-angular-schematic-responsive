import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { ModalComponent } from './components/modal/modal.component';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { LoadingScreenService } from './components/loading-screen/loading-screen.service';
import { LoadingScreenInterceptor } from "./services/loading-screen.interceptors";
import { ModalService } from './components/modal/modal.service';
import { LoadScriptService } from './services/load-scripts.service';
import { SeoService } from './services/seo.service';
import { ApiService } from './services/api.service';

@NgModule({
    declarations: [
        ModalComponent,
        LoadingScreenComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule
    ],
    exports: [
        ModalComponent,
        LoadingScreenComponent,
        HttpClientModule
    ],
    entryComponents: [
        ModalComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
    providers: [
        LoadScriptService,
        LoadingScreenService,
        ModalService,
        SeoService,
        ApiService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoadingScreenInterceptor,
            multi: true
        }
    ]
})
export class CapResponsiveModule { }