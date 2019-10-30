import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from './category-list/category-list.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { ModalComponent } from './modal/modal.component';
import { BalanceComponent } from './balance/balance.component';
import { ExpenseDetailComponent } from './expense-detail/expense-detail.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { HelloMonneyComponent } from './hello-monney/hello-monney.component';
import { ActivateUserComponent } from './activate-user/activate-user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';


 const routes: Routes = [
    { path: '', redirectTo: 'hello-monney', pathMatch: 'full' },
    //{ path: '', redirectTo: 'categories', pathMatch: 'full' },
    { path: 'hello-monney', component: HelloMonneyComponent },
    { path: 'login', component: LoginFormComponent },
    { path: 'autorize', component: LoginFormComponent },
    { path: 'categories', component: CategoryListComponent },
    { path: 'categories/:category/:categoryId', component: AddExpenseComponent },
    { path: 'categories/Income', component: AddExpenseComponent },
    { path: 'categories/:category/:status', component: ModalComponent },
    { path: 'login/:userName/:status', component: ModalComponent },
    { path: 'balance', component: BalanceComponent },
    { path: 'detail/:category', component: ExpenseDetailComponent },
    { path: 'activate/:token', component: ActivateUserComponent },
    { path: 'myprofile/:userid', component: UserProfileComponent },
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
