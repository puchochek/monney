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

import { BalanceComponent } from './balance/balance.component';
import { ExpenseDetailComponent } from './expense-detail/expense-detail.component';
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
import { ProfileManageCategoriesComponent } from './profile-manage-categories/profile-manage-categories.component';

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		CategoryListComponent,
		AddExpenseComponent,
		ModalComponent,
		BalanceComponent,
		ExpenseDetailComponent,
		LoginFormComponent,
		HelloMonneyComponent,
		ActivateUserComponent,
		UserProfileComponent,
		ProfileManageCategoriesComponent
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
		BrowserAnimationsModule
	],
	providers: [DataService],
	bootstrap: [AppComponent]
})
export class AppModule { }
