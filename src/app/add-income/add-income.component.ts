import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-add-income',
  templateUrl: './add-income.component.html',
  styleUrls: ['./add-income.component.scss']
})
export class AddIncomeComponent implements OnInit {

  sum: number;
  comment: string;
  dateToSave: string;
  status: string;
  isInvalidSum: boolean;

  constructor(
    private data: DataService, 
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getDate();
  }

  getDate() {
    this.data.currentDate.subscribe(date => {
      this.dateToSave = date;
    }, err => {
      console.log(err);
    });
  }

  onSubmit() {
    this.validateSum(this.sum) ? 
      this.collectDataForSaving() 
      : this.isInvalidSum = true;
  }

  validateSum(sum): boolean {
    if (isNaN(sum)||(!sum)) {
      return false;
    } else {
      this.isInvalidSum = false
      return true;
    }
  }

  collectDataForSaving() {
    const newIncome = {
      sum: this.sum, 
      comment: this.comment,
      date: this.dateToSave,
      type: 'Income'
    }; 
    console.log('newIncome ', newIncome);
    this.saveNewIncome(newIncome);
  }

  saveNewIncome(newIncome) {
    //console.log('newIncome Obj in Post', newIncome);
    this.http.post('http://localhost:3000/', {
      type: newIncome.type,
      dateToParse: newIncome.date,
      sum: newIncome.sum, 
      comment: newIncome.comment,
    }).subscribe((result) => {
      console.log('result ', result);
      if (result) {
        this.status = 'saved';
      } else {
        this.status = 'error';
      }
      this.router.navigate(['/income/' + '/' + this.status]);
    });
  }

}
