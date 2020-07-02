import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  Input,
  ElementRef,
  HostListener,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'img-lazy',
  templateUrl: './img-lazy.component.html',
  styleUrls: ['./img-lazy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class ImgLazyComponent implements OnInit {
  @Input()
  set src(src: string) {
    this._src = src;
    this.cd.detectChanges();
  }
  _src: string;

  get src(): string { return this._src; }

  @Input() alt: string;
  @Input() width: number;
  @Input() height: number;
  @Input() caption: boolean;
  @Output() isVisible = new EventEmitter();




  // Immutable object, only modify with setState
  state = {
    visible: false,
    loaded: false
  };

  constructor(
      private el: ElementRef, 
      private cd: ChangeDetectorRef,
      @Inject(PLATFORM_ID) private platformId: string) {
      }

  private setState(key, value) {
    this.state = { ...this.state, [key]: value };
    this.cd.detectChanges();
  }

  private calcVisibility() {
    if (isPlatformBrowser(this.platformId)) {
      const rect = this.el.nativeElement.getBoundingClientRect().top;
      if (rect <= window.innerHeight && !this.state.visible) {
        this.setState('visible', true);
        this.customEmit(true);
      }
    }
  }

  ngOnInit() {
    this.calcVisibility();
  }

  @HostListener('window:scroll', ['$event'])
  onscroll($event: Event) {
    this.calcVisibility();
  }

  onLoad() {
    setTimeout(() => {
      this.setState('loaded', true);
    }, 100);
  }

  // Making public methods
  @Input()
  public log = () => {
    const state = this.state;
    console.log(state);
  }

  // Custom Events
  private customEmit(val) {      
    this.isVisible.emit(val);
    const domEvent = new CustomEvent('is-visible');
    this.el.nativeElement.dispatchEvent(domEvent);
  }

}