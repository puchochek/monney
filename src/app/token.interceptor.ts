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
        // const existedToken
        //console.log('---> localStorage.token ', localStorage.getItem('token'));
        let jwtToken;
        if (localStorage.getItem('token')) {
            jwtToken = localStorage.getItem('token').includes('Bearer') ?
                localStorage.getItem('token')
                : `Bearer ${localStorage.getItem('token')}`;
        }
        //console.log('---> jwtToken ', jwtToken);
        if (jwtToken) {
            req = req.clone({
                setHeaders: {
                    Authorization: `${jwtToken}`
                }
            });
        }
        console.log('---> TokenInterceptor request ', req);
        return next.handle(req);
    }
}