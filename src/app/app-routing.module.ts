import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from './category-list/category-list.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { ModalComponent } from './modal/modal.component';
import { BalanceComponent } from './balance/balance.component';
import { ExpenseDetailComponent } from './expense-detail/expense-detail.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { HelloMonneyComponent } from './hello-monney/hello-monney.component';


 const routes: Routes = [
    //  { path: '', redirectTo: 'categories', pathMatch: 'full' },
    { path: '', redirectTo: 'hello-monney', pathMatch: 'full' },
    { path: 'hello-monney', component: HelloMonneyComponent },
    { path: 'login', component: LoginFormComponent },
    { path: 'categories', component: CategoryListComponent },
    { path: 'categories/:category', component: AddExpenseComponent },
    { path: 'categories/Income', component: AddExpenseComponent },
    { path: 'categories/:category/:status', component: ModalComponent },
    { path: 'balance', component: BalanceComponent },
    { path: 'detail/:category', component: ExpenseDetailComponent },
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
