import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable'; @Injectable()

export class TokenInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const bearerToken = localStorage.getItem('token');
        if (bearerToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: bearerToken
                }
            });
            console.log('---> INTERCEPTOR request ', request);
            return next.handle(request);
        } else {
            return next.handle(request);
        }
    }
}