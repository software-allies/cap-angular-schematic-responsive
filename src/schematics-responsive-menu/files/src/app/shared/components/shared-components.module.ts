import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ModalComponent } from './cap-components/modal/modal.component';
import { SaLoadingScreenComponent } from './cap-components/sa-loading-screen/sa-loading-screen.component';
import { SaLoadingScreenService } from './cap-components/sa-loading-screen/sa-loading-screen.service';

@NgModule({
    declarations: [
        ModalComponent,
        SaLoadingScreenComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ModalComponent,
        SaLoadingScreenComponent
    ],
    entryComponents: [
        ModalComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
    providers: [
        SaLoadingScreenService
    ]
})
export class SharedComponentsModule { }