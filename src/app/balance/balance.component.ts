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
  expencesTotal: number;
  gridColumns: number;
  expencesTableData = [];
  balance: number;
  showCategoryDetails: boolean;

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

    let categories = this.getExistedCategories(response);
    let currentMonth = this.getCurrentMonth();
    let thisMonthExpensies = this.getThisMonthExpensies(response, currentMonth);
    let expencesByCategories = this.getExpencesByCategories(categories, thisMonthExpensies);
    let incomes = this.getIncomesToRender(expencesByCategories['Income']);
    let totalIncomes = this.countTotalSum(expencesByCategories['Income'], 'sum');

    delete expencesByCategories['Income'];

    let expencesData = this.getExpencesData(expencesByCategories);
    let expencesToRender = this.getExpencesToRender(expencesData);
    let expencesToRenderSorted = this.sortExpencesToRender(expencesToRender);
    let totalExpences = this.countTotalSum(expencesToRenderSorted, 'total');

    console.log('expencesToRenderSorted ', expencesToRenderSorted);

    this.expencesTableData = expencesToRenderSorted;
    this.thisMonthIncomes = incomes;
    this.incomeTotal = totalIncomes;
    this.expencesTotal = totalExpences;
    this.balance = this.countBalance(totalIncomes, totalExpences);
    //this.gridColumns = Object.keys(expencesByCategories).length;
  }

  countBalance(totalIncomes, totalExpences) {
    return totalIncomes - totalExpences;
  }

  getIncomesToRender(incomes): any {
    let incomesToRender = incomes.reduce(function (incomesToRender, currentIncome) {
      currentIncome.date = currentIncome.date.substring(0, 10);
      incomesToRender.push(currentIncome);
      return incomesToRender;
    }, []);

    return incomesToRender;

  }

  getExistedCategories(response): any {
    let categories = response.reduce(function (categories, currentRecord) {
      if (!categories.includes(currentRecord.type)) {
        categories.push(currentRecord.type);
      }
      return categories;
    }, []);

    return categories;
  }

  getCurrentMonth(): string {
    let currentMonth = (new Date().getMonth() + 1).toString();
    currentMonth.length === 1 ?
    currentMonth = '0' + currentMonth
    : currentMonth = currentMonth;

    return currentMonth;
  }

  getExpencesByCategories(categories, thisMonthExpensies): any {
    let expencesByCategories = {};
    for (let i = 0; i < categories.length; i++) {
      expencesByCategories[categories[i]] = thisMonthExpensies.filter(expense => expense.type === categories[i]);
    }

    return expencesByCategories;
  }

  getThisMonthExpensies(response, currentMonth): any {
    let thisMonthExpensies = response.reduce(function (thisMonthExpensies, currentRecord) {
      if (currentMonth === currentRecord.date.substring(5, 7)) {
        thisMonthExpensies.push(currentRecord);
      }
      return thisMonthExpensies;
    }, []);

    return thisMonthExpensies;
  }

  getExpencesData(expencesByCategories): any {
    let expencesData = [];
    Object.keys(expencesByCategories).forEach(expenceByCategoriy => {
      let total = expencesByCategories[expenceByCategoriy].reduce(function (total, currentExpence) {
        total = total + (+currentExpence.sum);
        return total;
      }, 0);
      expencesData.push({
        category : expenceByCategoriy,
        expences : expencesByCategories[expenceByCategoriy],
        total : total
      });
    });

    return expencesData;
  }

  countTotalSum(arrayTohandle, fieldName): number {
    let sum = 0;
    arrayTohandle.forEach(item => {
      sum = sum + (+item[fieldName]);
    });

    return sum;
  }

  getExpencesToRender(expencesData): any {
    let expencesToRender = expencesData.reduce(function (expencesToRender, currentExpence) {
      currentExpence.expences.forEach(expence => {
        expence.date = expence.date.substring(0, 10);
      });
      expencesToRender.push(currentExpence);
      return expencesToRender;
    }, []);

    return expencesToRender;
  }

  sortExpencesToRender(expencesToRender): any {
    let expencesToRenderSorted = expencesToRender.slice(0);
    expencesToRenderSorted.sort(function(a, b) {
      return b.total - a.total;
    });

    return expencesToRenderSorted;
  }

  showDetails() {
    //TODO ADD NEW COMPONENT TO SHOW DETAILS
    //this.showCategoryDetails = true;

  }

}
