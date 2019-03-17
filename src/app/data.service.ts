import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FinanceData } from './interfaces';

@Injectable()
export class DataService {

  private dateSource = new BehaviorSubject<string>('default');
  currentDate = this.dateSource.asObservable();

  constructor(private http: HttpClient, ) { }

  setData(dateToSave: string) {
    this.dateSource.next(dateToSave);
  }

  formatResponseDate(response: FinanceData[]): FinanceData[] {
    const formattedResponse = response.reduce(function (resultArray, currentExpense) {
      currentExpense.date = currentExpense.date.substring(0, 10);
      resultArray.push(currentExpense);
      return resultArray;
    }, []);

    return formattedResponse;
  }

}