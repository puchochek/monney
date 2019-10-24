import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const jwtToken = localStorage.getItem('token')
        console.log('---> jwtToken ', jwtToken );
        if (!!jwtToken) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
        }
        console.log('---> request A', req );
        return next.handle(req);
    }
}