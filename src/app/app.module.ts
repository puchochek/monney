import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { DataService } from './data.service';
import { ModalComponent } from './modal/modal.component';

import { LoginFormComponent } from './login-form/login-form.component';
import { HelloMonneyComponent } from './hello-monney/hello-monney.component';
import { ActivateUserComponent } from './activate-user/activate-user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	MatAutocompleteModule,
	MatButtonModule,
	MatButtonToggleModule,
	MatCardModule,
	MatCheckboxModule,
	MatChipsModule,
	MatCommonModule,
	MatDatepickerModule,
	MatDialogModule,
	MatDividerModule,
	MatExpansionModule,
	MatFormFieldModule,
	MatGridListModule,
	MatIconModule,
	MatInputModule,
	MatLineModule,
	MatListModule,
	MatMenuModule,
	MatNativeDateModule,
	MatOptionModule,
	MatPaginatorModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatPseudoCheckboxModule,
	MatRadioModule,
	MatRippleModule,
	MatSelectModule,
	MatSidenavModule,
	MatSliderModule,
	MatSlideToggleModule,
	MatSnackBarModule,
	MatSortModule,
	MatStepperModule,
	MatTableModule,
	MatTabsModule,
	MatToolbarModule,
	MatTooltipModule,
} from '@angular/material';
import { AddCategoryModalComponent } from './add-category-modal/add-category-modal.component';
import { IgxAvatarModule } from 'igniteui-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '././token.interceptor';
import { HomeComponent } from './home/home.component';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { FileUploadModule } from "ng2-file-upload";
import { DashboardConfigComponent } from './dashboard-config/dashboard-config.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { AreaChartComponent } from './area-chart/area-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		CategoryListComponent,
		AddExpenseComponent,
		ModalComponent,
		LoginFormComponent,
		HelloMonneyComponent,
		ActivateUserComponent,
		UserProfileComponent,
		AddCategoryModalComponent,
		HomeComponent,
		ModalComponent,
		TransactionDetailComponent,
		DashboardConfigComponent,
		DashboardComponent,
		PieChartComponent,
		AreaChartComponent,
		BarChartComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		FormsModule, MatAutocompleteModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatCardModule,
		MatCheckboxModule,
		MatChipsModule,
		MatCommonModule,
		MatDatepickerModule,
		MatDialogModule,
		MatDividerModule,
		MatExpansionModule,
		MatFormFieldModule,
		MatGridListModule,
		MatIconModule,
		MatInputModule,
		MatLineModule,
		MatListModule,
		MatMenuModule,
		MatNativeDateModule,
		MatOptionModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatPseudoCheckboxModule,
		MatRadioModule,
		MatRippleModule,
		MatSelectModule,
		MatSidenavModule,
		MatSlideToggleModule,
		MatSliderModule,
		MatSnackBarModule,
		MatSortModule,
		MatStepperModule,
		MatTableModule,
		MatTabsModule,
		MatToolbarModule,
		MatTooltipModule,
		BrowserAnimationsModule,
		IgxAvatarModule,
		FileUploadModule
	],
	providers: [DataService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptor,
			multi: true
		}
	],
	bootstrap: [AppComponent],
	entryComponents: [AddCategoryModalComponent, ModalComponent]
})
export class AppModule { }
