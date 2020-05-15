import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Input, PLATFORM_ID, Inject } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';



@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  @Input()
  title: string;

  @Input()
  background: string;

  deviceChecked = false;

  constructor(@Inject(PLATFORM_ID) private platformId: string, private deviceService: DeviceDetectorService) {
    if (isPlatformBrowser(this.platformId)) {
      const isMobile = this.deviceService.isMobile();
      console.log('isMobile', isMobile);
      if (isMobile) {
        this.background = this.background + '_s';
        this.deviceChecked = true;
      } else {
        this.deviceChecked = true;
      }
    }
  }

  ngOnInit(): void {
  }

}
