import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { FinanceData } from '../interfaces';
import { DataService } from '../data.service';

@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.scss']
})
export class ExpenseDetailComponent implements OnInit {

  selectedCategory: string;
  expensesByCategory: FinanceData[];
  isEmptyExpencesList: boolean;
  isExpencesList: boolean;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private data: DataService
  ) { }

  ngOnInit() {
    const selectedCategory = this.route.snapshot.paramMap.get('category');
    this.selectedCategory = selectedCategory;

    this.connectDataBase();
  }

  connectDataBase() {
    // use for get-request
    this.http.get('http://localhost:3000/expences/' + this.selectedCategory).subscribe((response: FinanceData[]) => {
      this.setExpensesByCategory(response);
    });
  }

  setExpensesByCategory(response: FinanceData[]) {
    const formattedResponse = this.formatResponseDate(response);
    const thisMonthExpenses = this.getThisMonthExpences(formattedResponse);
    const sortedResponse = this.sortDataByDate(thisMonthExpenses);

    this.isEmptyExpencesList = !sortedResponse.length;
    this.isExpencesList = !this.isEmptyExpencesList;

    this.expensesByCategory = sortedResponse;
  }

  formatResponseDate(response: FinanceData[]): FinanceData[] {
    // const formattedResponse = response.reduce(function (resultArray, currentExpense) { //do I need replace this method to servis?
    //   currentExpense.date = currentExpense.date.substring(0, 10);
    //   resultArray.push(currentExpense);
    //   return resultArray;
    // }, []);

    // return formattedResponse;

    return this.data.formatResponseDate(response);
  }

  getThisMonthExpences(formattedResponse: FinanceData[]): FinanceData[] {  // TODO this logic is also used in balance component. 
    const currentMonth = this.getCurrentMonth();
    const thisMonthExpences = formattedResponse.filter(expense => expense.date.substring(5, 7) === currentMonth);

    return thisMonthExpences;
  }

  getCurrentMonth(): string {
    let currentMonth = (new Date().getMonth() + 1).toString();
    currentMonth.length === 1 ?
    currentMonth = '0' + currentMonth
    : currentMonth = currentMonth;

    return currentMonth;
  }

  sortDataByDate(thisMonthExpenses: FinanceData[]): FinanceData[] {
    const sortedResponse = thisMonthExpenses.slice(0);
    sortedResponse.sort(function(a, b) {
      return +b.date.substring(5, 7) - +a.date.substring(5, 7);
    });

    return sortedResponse;
  }

}
