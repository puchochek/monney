import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from './category-list/category-list.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { ModalComponent } from './modal/modal.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { HelloMonneyComponent } from './hello-monney/hello-monney.component';
import { ActivateUserComponent } from './activate-user/activate-user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { HomeComponent } from './home/home.component';
import { AddCategoryModalComponent } from './add-category-modal/add-category-modal.component';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';

 const routes: Routes = [
    { path: '', redirectTo: 'hello-monney', pathMatch: 'full' },
    { path: 'hello-monney', component: HelloMonneyComponent },
    { path: 'login', component: LoginFormComponent },
    { path: 'autorize', component: LoginFormComponent },
    { path: 'home', component: HomeComponent },
    { path: 'categories', component: CategoryListComponent },
    { path: 'categories/:category/:action/:categoryId', component: AddExpenseComponent },
    { path: 'login/:userName/:status', component: ModalComponent },
    { path: 'detail/:category', component: TransactionDetailComponent },
    { path: 'activate/:token', component: ActivateUserComponent },
    { path: 'myprofile/:userid', component: UserProfileComponent },
    { path: 'category', component: AddCategoryModalComponent },
    { path: 'category/:categoryId', component: AddCategoryModalComponent },
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
