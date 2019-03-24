import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FinanceData } from '../interfaces';
import { ExpencesData } from '../interfaces';

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
  isDetailModal: boolean;

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
    this.http.get('http://localhost:3000/expence').subscribe((response: FinanceData[]) => {
    this.parseResponse(response);
    });
  }

  parseResponse(response: FinanceData[]) {
    const categories = this.getExistedCategories(response);
    const currentMonth = this.getCurrentMonth();
    const thisMonthExpensies = this.getThisMonthExpensies(response, currentMonth);
    const expencesByCategories = this.getExpencesByCategories(categories, thisMonthExpensies);
    const incomes = this.getIncomesToRender(expencesByCategories['Income']);
    const totalIncomes = this.countTotalSum(expencesByCategories['Income'], 'sum');

    delete expencesByCategories['Income'];

    const expencesData = this.getExpencesData(expencesByCategories);
    const expencesToRender = this.getExpencesToRender(expencesData);
    const expencesToRenderSorted = this.sortExpencesToRender(expencesToRender);
    const totalExpences = this.countTotalSum(expencesToRenderSorted, 'total');

    console.log('expencesToRenderSorted ', expencesToRenderSorted);

    this.expencesTableData = expencesToRenderSorted;
    this.thisMonthIncomes = incomes;
    this.incomeTotal = totalIncomes;
    this.expencesTotal = totalExpences;
    this.balance = this.countBalance(totalIncomes, totalExpences);
    // this.gridColumns = Object.keys(expencesByCategories).length;
  }

  countBalance(totalIncomes: number, totalExpences: number): number {
    return totalIncomes - totalExpences;
  }

  getIncomesToRender(incomes: FinanceData[]): FinanceData[] {
    const incomesToRender = incomes.reduce(function (resultArray, currentIncome) {
      currentIncome.date = currentIncome.date.substring(0, 10);
      resultArray.push(currentIncome);
      return resultArray;
    }, []);

    return incomesToRender;
  }

  getExistedCategories(response: FinanceData[]): string[] {
    const categories = response.reduce(function (resultArray, currentRecord) {
      if (!resultArray.includes(currentRecord.type)) {
        resultArray.push(currentRecord.type);
      }
      return resultArray;
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

  getExpencesByCategories(categories: string[], thisMonthExpensies: FinanceData[]): any {  // TODO add returned type
    const expencesByCategories = {};
    for (let i = 0; i < categories.length; i++) {
      expencesByCategories[categories[i]] = thisMonthExpensies.filter(expense => expense.type === categories[i]);
    }

    return expencesByCategories;
  }

  getThisMonthExpensies(response: FinanceData[], currentMonth: string): any {
    const thisMonthExpensies = response.reduce(function (resultArray, currentRecord) {
      if (currentMonth === currentRecord.date.substring(5, 7)) {
        resultArray.push(currentRecord);
      }
      return resultArray;
    }, []);

    return thisMonthExpensies;
  }

  getExpencesData(expencesByCategories): any { // TODO add returned type
    const expencesData = [];
    Object.keys(expencesByCategories).forEach(expenceByCategoriy => {
      const total = expencesByCategories[expenceByCategoriy].reduce(function (resultArray, currentExpence) {
        resultArray = resultArray + (+currentExpence.sum);
        return resultArray;
      }, 0);
      expencesData.push({
        category : expenceByCategoriy,
        expences : expencesByCategories[expenceByCategoriy],
        total : total
      });
    });

    return expencesData;
  }

  countTotalSum(arrayToHandle: FinanceData[], fieldName: string): number {
    let sum = 0;
    arrayToHandle.forEach(item => {
      sum = sum + (+item[fieldName]);
    });

    return sum;
  }

  getExpencesToRender(expencesData: ExpencesData[]): ExpencesData[] {
    const expencesToRender = expencesData.reduce(function (resultArray, currentExpence) {
      currentExpence.expences.forEach(expence => {
        expence.date = expence.date.substring(0, 10);
      });
      resultArray.push(currentExpence);
      return resultArray;
    }, []);

    return expencesToRender;
  }

  sortExpencesToRender(expencesToRender: ExpencesData[]): any {  // TODO check field types
    const expencesToRenderSorted = expencesToRender.slice(0);
    expencesToRenderSorted.sort(function(a, b) {
      return b.total - a.total;
    });

    return expencesToRenderSorted;
  }

  showDetails(event: Event) {
    this.showCategoryDetails = true;
    //this.isDetailModal = true;
    const elementId: string = (event.target as Element).id;
    console.log(elementId);

  }

}
