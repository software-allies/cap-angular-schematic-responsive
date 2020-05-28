import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export class MetaTag {
    name: string;
    value: string;
    isFacebook: boolean;

    constructor(name: string, value: string, isFacebook: boolean) {
        this.name = name;
        this.value = value;
        this.isFacebook = isFacebook;
    }
}

@Injectable({
    providedIn: 'root'
  })
export class SeoService {
  private urlMeta: string = "og:url";
  private titleMeta: string = "og:title";
  private descriptionMeta: string = "og:description";
  private imageMeta: string = "og:image";
  private imageAltMeta: string = "og:image:alt";
  private imageUrlMeta: string = "og:image:url";
  private imageHeightMeta: string = "og:image:height";
  private imageWidthMeta: string = "og:image:width";
  private secureImageMeta: string = "og:image:secure_url";
  private typeMeta: string = "og:type";
  private twitterTitleMeta: string = "twitter:title";
  private twitterImageMeta: string = "twitter:image";
  private twitterImageAltMeta: string = "twitter:image:alt";
  private twitterDescriptionMeta: string = "twitter:description";
  private twitterCardMeta: string = "twitter:card";
  private twitterDomainMeta: string = "twitter:domain";
  private appIdMeta: string = "fb:app_id";
  private siteNameMeta: string = "og:site_name";

  constructor(
    private meta: Meta, 
    private title: Title, 
    @Inject(DOCUMENT) private document: Document) { }

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
  }

  setSocialMediaTags(
    _url: string, 
    title: string, 
    description: string, 
    image: string, 
    type: string,
    siteNameMeta: string,
    imageHeigh: string, 
    imageWidth: string,
    twitterCardMeta: string, 
    twitterDomainMeta: string
  ): void {
    var tags = [
      new MetaTag(this.urlMeta, _url, true),
      new MetaTag(this.titleMeta, title, true),
      new MetaTag(this.descriptionMeta, description, true),
      new MetaTag(this.imageMeta, image, true),
      new MetaTag(this.imageUrlMeta, image, true),
      new MetaTag(this.imageAltMeta, title, true),
      new MetaTag(this.secureImageMeta, image, true),
      new MetaTag(this.typeMeta, type, true),
      new MetaTag(this.siteNameMeta, siteNameMeta, true),
      new MetaTag(this.imageHeightMeta, imageHeigh, true),
      new MetaTag(this.imageWidthMeta, imageWidth, true),
      new MetaTag(this.twitterTitleMeta, title, false),
      new MetaTag(this.twitterImageMeta, image, false),
      new MetaTag(this.twitterImageAltMeta, title, false),
      new MetaTag(this.twitterDescriptionMeta, description, false),
      new MetaTag(this.twitterCardMeta, twitterCardMeta, false),
      new MetaTag(this.twitterDomainMeta, twitterDomainMeta, false)
    ];
    this.setTags(tags);
  }

  private setTags(tags: MetaTag[]): void {
    tags.forEach(siteTag => {
      const tag = siteTag.isFacebook ?  this.meta.getTag(`property='${siteTag.name}'`) : this.meta.getTag(`name='${siteTag.name}'`);
      if (siteTag.isFacebook) {
        this.meta.updateTag({ property: siteTag.name, content: siteTag.value });
      } else {
        this.meta.updateTag({ name: siteTag.name, content: siteTag.value });
      }
    });
  }

  setCanonicalURL(_url?: string) {
    const canURL = _url === undefined ? this.document.URL : _url;
    const link: HTMLLinkElement = this.document.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.document.head.appendChild(link);
    link.setAttribute('href', canURL);
  }

}