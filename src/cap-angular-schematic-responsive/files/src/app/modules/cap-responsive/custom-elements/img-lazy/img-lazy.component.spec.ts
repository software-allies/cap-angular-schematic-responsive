import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { ImgLazyComponent } from './img-lazy.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';



describe('ImgLazyComponent test', () => {

    let fixture: ComponentFixture<ImgLazyComponent>;
    let debugElement: DebugElement;
    let component: ImgLazyComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ImgLazyComponent
            ]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ImgLazyComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
    });

    it ('create component', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });


    it ('should put the image if you pass the src parameter', () => {
        component.src = 'https://avatars1.githubusercontent.com/u/21238529?s=180&v=4';
        fixture.detectChanges();
        const cardElement = debugElement.query(By.css('img'));
        expect(cardElement.nativeElement.src).toBe('https://avatars1.githubusercontent.com/u/21238529?s=180&v=4');
    });

    it ('should put the alt text if you pass the alt parameter', () => {
        component.alt = 'Concept 123';
        fixture.detectChanges();
        const cardElement = debugElement.query(By.css('img'));
        expect(cardElement.nativeElement.alt).toBe('Concept 123');
    });


    it ('should state loaded is true', fakeAsync(() => {
        fixture.detectChanges();
        expect(component.state.loaded).toBeFalsy();

        component.onLoad();
        tick(100);
        expect(component.state.loaded).toBeTruthy();
    }));


    /*
        Project content
    it ('should show 123 price', () => {
        fixture.detectChanges();

        const span = document.createElement('span');
        span.classList.add('price');
        span.innerHTML = '123';
        expect(debugElement.nativeElement.attr('select')).toBe('123');

    }); */


});
