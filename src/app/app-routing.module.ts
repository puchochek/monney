import { InjectionToken, NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { HomeComponent } from '../app/home/home.component';
import { LoginComponent } from '../app/login/login.component';
import { AuthComponent } from '../app/auth/auth.component';
import { ExternalRedirectComponent } from '../app/external-redirect/external-redirect.component';

const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver');

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'singin', component: LoginComponent },
    { path: 'singup', component: LoginComponent },
    { path: 'auth/:token', component: AuthComponent},
    { path: 'externalRedirect', resolve: { url: externalUrlProvider, }, component: ExternalRedirectComponent },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
    exports: [RouterModule],
    providers: [
        {
            provide: externalUrlProvider,
            useValue: (route: ActivatedRouteSnapshot) => {
                const externalUrl = route.paramMap.get('externalUrl');
                window.open(externalUrl, '_self');
            },
        },
    ],
})

export class AppRoutingModule { }
