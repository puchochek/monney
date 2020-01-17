import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { ExternalRedirectComponent } from './external-redirect/external-redirect.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '././token.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
	MatMenuModule,
	MatButtonModule,
	MatProgressSpinnerModule,
	MatIconModule,
	MatDialogModule,
	MatCardModule,
	MatTooltipModule,
	MatInputModule,
	MatNativeDateModule,
	MatDatepickerModule,
	MatCheckboxModule
} from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SpinnerComponent } from './spinner/spinner.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryComponent } from './category/category.component';
import { IgxAvatarModule } from 'igniteui-angular';
import { SelectIconComponent } from './select-icon/select-icon.component';
import { TransactionComponent } from './transaction/transaction.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { TransactionsByCategoryComponent } from './transactions-by-category/transactions-by-category.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { FileUploadModule } from "ng2-file-upload";
import { BalanceComponent } from './balance/balance.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ChartSetupComponent } from './chart-setup/chart-setup.component';
import { ChartComponent } from './chart/chart.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './store/reducers/chart.reducer';


@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		LoginComponent,
		HomeComponent,
		AuthComponent,
		ExternalRedirectComponent,
		SpinnerComponent,
		CategoriesComponent,
		CategoryComponent,
		SelectIconComponent,
		TransactionComponent,
		DatepickerComponent,
		TransactionsByCategoryComponent,
		ConfirmationModalComponent,
		UserProfileComponent,
		BalanceComponent,
		ChartSetupComponent,
		ChartComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		MatMenuModule,
		MatButtonModule,
		MatProgressSpinnerModule,
		MatIconModule,
		MatDialogModule,
		MatCardModule,
		MatTooltipModule,
		MatDatepickerModule,
		MatInputModule,
		MatCheckboxModule,
		MatNativeDateModule,
		IgxAvatarModule,
		FileUploadModule,
		NgxChartsModule,
		StoreModule.forRoot({ chartSetup: reducer }),
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptor,
			multi: true
		}
	],
	bootstrap: [AppComponent],
	entryComponents: [SelectIconComponent, ConfirmationModalComponent]
})
export class AppModule {
}
