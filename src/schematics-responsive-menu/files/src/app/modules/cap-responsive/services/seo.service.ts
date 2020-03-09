import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
  })
export class SeoService {

  constructor(
    private meta: Meta, 
    private title: Title) { }

  generateTags(config) {
    // default values
    config = { 
      title: 'Title', 
      description: 'Description',
      keywords: 'Keyords',
      ...config
    };

    this.title.setTitle(config.title);
    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ name: 'keywords', content: config.keywords });
  }

}
