import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { DataService } from "../data.service";
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

  thisMonthIncomes = [];
  incomeTotal: number;
  gridColumns: number;
  //expenses = {};

  constructor(
    private data: DataService, 
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.connectDataBase();
  }

  connectDataBase() {
    // use for get-request
    this.http.get('http://localhost:3000/').subscribe((response) => {
      this.parseResponse(response);
    });
  }

  parseResponse(response) {
    let categories = response.reduce(function (categories, currentRecord) {
      if (!categories.includes(currentRecord.type)) {
        categories.push(currentRecord.type);
      }
      return categories;
    }, []);

    let currentMonth = (new Date().getMonth() + 1).toString();
    currentMonth.length === 1 ?
    currentMonth = '0' + currentMonth
    : currentMonth = currentMonth;

    let thisMonthExpensies = response.reduce(function (thisMonthExpensies, currentRecord) {
      if (currentMonth === currentRecord.date.substring(5, 7)) {
        thisMonthExpensies.push(currentRecord);
      }
      return thisMonthExpensies;
    }, []);

    let expencesByCategories = {};
    for (let i = 0; i < categories.length; i++) {
      expencesByCategories[categories[i]] = thisMonthExpensies.filter(expense => expense.type === categories[i]);
    }

    let incomes = expencesByCategories['Income'];
    let sum = 0;
    incomes.forEach(income => {
      sum = sum + (+income.sum);
    });

    delete expencesByCategories['Income'];
    this.gridColumns = Object.keys(expencesByCategories).length;
    console.log('expencesByCategories ', expencesByCategories);
    //this.expenses = expencesByCategories;

    incomes = incomes.reduce(function (incomesToRender, currentIncome) {
      currentIncome.date = currentIncome.date.substring(0, 10);
      incomesToRender.push(currentIncome);
      return incomesToRender;
    }, []);

    this.thisMonthIncomes = incomes;
    console.log('thisMonthIncomes ', this.thisMonthIncomes);
    this.incomeTotal = sum;
  }

  setGridMarkup() {
    let gridMarkup = '';
    for (let i = 0; i < this.gridColumns; i++) {
      gridMarkup = gridMarkup + '2fr ';
    }

    return new Object({'grid-template-columns': gridMarkup});
  }






}
