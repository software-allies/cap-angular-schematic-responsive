import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';


function getHeadersMap(headers: HttpHeaders) {
  const headersMap: Record<string, string[] | null> = {};
  for (const key of headers.keys()) {
    headersMap[key] = headers.getAll(key);
  }
  return headersMap;
}

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, any>();

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // continue request if not cacheable.
    if (!this.canCache(request)) {
      return next.handle(request);
    }

    if (request.method !== 'GET') {
      return next.handle(request);
    }

    const cachedResponse = this.cache.get(request.url);
    if (cachedResponse) {      
      const response = {
        body: cachedResponse.body,
        headers: new HttpHeaders(cachedResponse.headers),
        status: cachedResponse.status,
        statusText: cachedResponse.statusText + ' (cached browser response)',
        url: cachedResponse.url
      }
      return of(new HttpResponse(response));
    }

    return next.handle(request).pipe(
      tap((event: any) => {
        if (event instanceof HttpResponse && event.status == 200) {
          // http response is not a POJO and it needs custom serialization/deserialization.
          const response = {
            body: event.body,
            headers: getHeadersMap(event.headers),
            status: event.status,
            statusText: event.statusText,
            url: event.url || '',
          };
          this.cache.set(request.url, response);
        }
      })
    );
  }

  canCache(req: HttpRequest<any>): boolean {
    // only cache if URL includes...
    // return (req.url.includes('categories'));
    return true;
  }
}
