import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, pipe, throwError, Subject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private httpOptions: any;
    private apiUrl: string;

    constructor(private _http: HttpClient) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            observe: "response"
        };
        this.apiUrl = '${environment.apiUrl}';
    }

  get(url: string): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}${url}`, this.httpOptions)
    .pipe(
      map((response: any) => response.body),
      tap((response: any) => {
          return response;
      }),
      catchError(error => this.handleError(error))
    );
  }

  post(url: string, data: any) : Observable<any> {
    return this._http.post<HttpResponse<any>>(`${this.apiUrl}${url}`, data, this.httpOptions)
    .pipe(
      map(response => response),
      tap((response: HttpResponse<any>) => {
          return response;
      }),
      catchError(error => this.handleError(error))
    );
  }

  deleteById(url: string, id: string) : Observable<any> {
    return this._http.delete<HttpResponse<any>>(`${this.apiUrl}${url}/${id}`, this.httpOptions)
    .pipe(
        map(response => response),
        tap((response: HttpResponse<any>) => {
            return response;
        }),
        catchError(error => this.handleError(error))
    );
  }

  private handleError(error: any) {
    console.log(error);
    return throwError(error || 'Server error');
  }
}
