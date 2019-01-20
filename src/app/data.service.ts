import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  private dateSource = new BehaviorSubject<string>('default');
  currentDate = this.dateSource.asObservable();
  
  constructor() { }

  setData(dateToSave: string) { 
    this.dateSource.next(dateToSave);
  }

}