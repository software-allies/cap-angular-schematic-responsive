import { Component, OnInit } from '@angular/core';
import { SeoService } from './../modules/cap-responsive/services/seo.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private seoService: SeoService) {
  }

  ngOnInit() {
    const tags = {
      title: 'Home SEO Title',
      description: 'Home SEO Description'
    };
    this.seoService.generateTags(tags);
  }

}
