import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbsComponent implements OnInit {

  @Input('links')
  set links(links: any) {
    this.breadcrumbs = this.getKeys(links);
    this.chdRef.detectChanges();
  }

  breadcrumbs = [];

  constructor(
    private chdRef: ChangeDetectorRef
  ) { }

  getKeys(links: any): any[] {
      if (typeof links !== 'object') {
        console.error('Object.keys called on non-object');
        return;
      }
      const breadcrumbs = [];
      Object.keys(links).map(link => {
        breadcrumbs.push({label: link, target: links[link]});
      });
      return breadcrumbs;
  }

  ngOnInit(): void {
  }

}
