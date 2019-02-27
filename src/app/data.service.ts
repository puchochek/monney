import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http'; import { Observable } from 'rxjs';

@Injectable()
export class DataService {

  private dateSource = new BehaviorSubject<string>('default');
  currentDate = this.dateSource.asObservable();

  constructor(private http: HttpClient, ) { }

  setData(dateToSave: string) {
    this.dateSource.next(dateToSave);
  }

}