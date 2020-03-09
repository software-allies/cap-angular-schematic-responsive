import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, pipe, throwError, Subject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private actionUrl: string;
    private httpOptions: any;
    private apiUrl: string;

    constructor(
        private _http: HttpClient
    ) {
        this.httpOptions = {
            headers: new HttpHeaders({ 
                'Content-Type': 'application/json',
                'Authorization': 'Token token=' + environment.apiToken
            }),
            observe: "response"
        };
        this.apiUrl = `${environment.apiUrl}`;
    }

    get(): Observable<any> {
        const _url = `${this.apiUrl}endpoint`;
        return this._http.get<any>(_url, this.httpOptions)
        .pipe(
            map((response: any) => response.body),
            tap((response: any) => {
                return response;
            }),
            catchError(error => this.handleError(error))
        );
    }
    
    post() : Observable<any> { 
        const _url = `${this.apiUrl}endpoint`;
        return this._http.post<HttpResponse<any>>(_url, {}, this.httpOptions)
        .pipe(
            map(response => response),
            tap((response: HttpResponse<any>) => {
                return response;
            }),
            catchError(error => this.handleError(error))
        );
    }

    deleteById(id: string) : Observable<any> { 
        const _url = `${this.apiUrl}endpoint/${id}`;
        return this._http.delete<HttpResponse<any>>(_url, this.httpOptions)
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
