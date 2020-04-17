import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { SeoService } from './../modules/cap-responsive/services/seo.service';
import { ApiService } from './../modules/cap-responsive/services/api.service';

export interface ResponseDataInterface {
  success: string;
  data: any[];
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  exampleItems$: Observable<ResponseDataInterface>;

  constructor(
    private seoService: SeoService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // Example setting metatags
    const tags = {
      title: 'Home SEO Title',
      description: 'Home SEO Description'
    };
    this.seoService.generateTags(tags);
  }

}
