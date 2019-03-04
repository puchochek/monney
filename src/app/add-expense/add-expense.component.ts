import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss'],
  providers: []
})
export class AddExpenseComponent implements OnChanges, OnInit {

  @Input() sum: number;
  @Input() comment: string;

  // sum: number;
  // comment: string;
  dateToSave: string;
  category: string;
  status: string;
  isInvalidInput: boolean;
  invalidInputMessage: string;

  constructor(
    private data: DataService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    const selectedCategory = this.route.snapshot.paramMap.get('category');
    this.category =  selectedCategory;
    this.getDate();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes');
    console.log('changes ', changes);
  }

  validateSumInput(event) {
    console.log('validateInput ', event);
    const currentInput = event.data;
    this.isInvalidInput = currentInput === null ?
      false
      : !this.validateSum(currentInput);
    if (this.isInvalidInput) {
      this.invalidInputMessage = `Fill the Sum field with a number.`;
    }
  }

  getDate() {
    this.data.currentDate.subscribe(date => {
      this.dateToSave = date;
    }, err => {
      console.log(err);
    });
  }

  onSubmit() {
    this.collectDataForSaving();
  }

  collectDataForSaving() {
    const newExpence = {
      sum: this.sum,
      comment: this.comment,
      type: this.category,
      date: this.dateToSave,
    };

    this.saveNewExpence(newExpence);
  }

  validateSum(sum: number): boolean {
    if (isNaN(sum) || (!sum)) {
      return false;
    } else {
      this.isInvalidInput = false;
      return true;
    }
  }

  // connectDataBase() {
  //   //use for get-request
  //   this.http.get('http://localhost:3000/expences').subscribe((response) => {
  //   });
  // }

  saveNewExpence(newExpence) {
    // console.log('newExpence Obj in Post', newExpence);
    this.http.post('http://localhost:3000/expences', {
      type: newExpence.type,
      dateToParse: newExpence.date,
      sum: newExpence.sum, 
      comment: newExpence.comment,
    }).subscribe((result) => {
      console.log('result ', result);
      if (result) {
        this.status = 'saved';
      } else {
        this.status = 'error';
      }
      this.router.navigate(['/categories/' + this.category + '/' + this.status]);
    });
  }

 
}
