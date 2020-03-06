import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SaLoadingScreenService } from './sa-loading-screen.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-sa-loading-screen',
  templateUrl: './sa-loading-screen.component.html',
  styleUrls: ['./sa-loading-screen.component.scss']
})
export class SaLoadingScreenComponent implements OnInit, OnDestroy {

  loading = false;
  loadingSubscription: Subscription;

  constructor(private loadingScreenService: SaLoadingScreenService) {
  }

  ngOnInit() {
    this.loadingSubscription = this.loadingScreenService.loadingStatus.pipe(
      debounceTime(200)
    ).subscribe((value: boolean) => {
      this.loading = value;
    });
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }

}
