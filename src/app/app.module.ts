import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { DataService } from "./data.service";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CategoryListComponent,
    AddExpenseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
