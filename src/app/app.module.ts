import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { DataService } from './data.service';
import { ModalComponent } from './modal/modal.component';

import { MatIconModule } from '@angular/material/icon';
import { BalanceComponent } from './balance/balance.component';
import { ExpenseDetailComponent } from './expense-detail/expense-detail.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { HelloMonneyComponent } from './hello-monney/hello-monney.component';
import { ActivateUserComponent } from './activate-user/activate-user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

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
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatIconModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
