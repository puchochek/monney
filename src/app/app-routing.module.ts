import { InjectionToken, NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { HomeComponent } from '../app/home/home.component';
import { LoginComponent } from '../app/login/login.component';
import { AuthComponent } from '../app/auth/auth.component';
import { ExternalRedirectComponent } from '../app/external-redirect/external-redirect.component';
import { CategoryComponent } from '../app/category/category.component';
import { TransactionComponent } from '../app/transaction/transaction.component';
import { TransactionsByCategoryComponent } from '../app/transactions-by-category/transactions-by-category.component';
import { UserProfileComponent } from '../app/user-profile/user-profile.component';
import { ChartSetupComponent } from '../app/chart-setup/chart-setup.component';
import { ChartComponent } from '../app/chart/chart.component';

const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver');

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'singin', component: LoginComponent },
    { path: 'singup', component: LoginComponent },
    { path: 'category/add', component: CategoryComponent },
    { path: 'category/edit/:id', component: CategoryComponent },
    { path: ':category/add', component: TransactionComponent },
    { path: ':category/edit/:id', component: TransactionComponent },
    { path: 'auth/:token', component: AuthComponent},
    { path: ':category/transactions', component: TransactionsByCategoryComponent},
    { path: 'user', component: UserProfileComponent},
    { path: 'reports', component: ChartSetupComponent},
    { path: 'report/:chartType', component: ChartComponent},
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
