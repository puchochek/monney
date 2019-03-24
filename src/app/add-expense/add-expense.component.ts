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

  dateToSave: string;
  category: string;
  status: string;
  isInvalidInput: boolean;
  invalidInputMessage: string;
  dateShiftLeft = 0;
  dateShiftRight = 0;
  isToggled = false;

  constructor(
    private data: DataService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    const selectedCategory = this.route.snapshot.paramMap.get('category');
    this.category =  selectedCategory;
    this.dateToSave = this.getCurrentDate();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes');
    console.log('changes ', changes);
  }

  getCurrentDate(): string {
    const dayWithShift = new Date();
    const today = new Date();
    dayWithShift.setDate(today.getDate() + this.dateShiftLeft + this.dateShiftRight);
    const currentDate = dayWithShift.getDate();
    const currentMonth = dayWithShift.getMonth() + 1;
    const currentYear = dayWithShift.getFullYear();
    const currentDay = this.getDayOfWeek(dayWithShift.getDay());

    return `${currentDate}.${currentMonth}.${currentYear} ${currentDay} `;
  }

  getDayOfWeek(currentDay: number): string {
    switch (currentDay) {
      case 0: {
        return 'Sun';
      }
      case 1: {
        return 'Mon';
      }
      case 2: {
        return 'Tue';
      }
      case 3: {
        return 'Wed';
      }
      case 4: {
        return 'Thu';
      }
      case 5: {
        return 'Fri';
      }
      case 6: {
        return 'Sat';
      }
    }
  }

  goToPrevDate(): void {
    this.isToggled = true;
    this.dateShiftLeft = this.dateShiftLeft - 1;
    this.dateToSave = this.getCurrentDate();
  }

  goToNextDate(): void {
    this.dateShiftRight = this.dateShiftRight + 1;
    this.dateToSave = this.getCurrentDate();
    if (this.dateShiftRight + this.dateShiftLeft === 0) {
      this.isToggled = false;
    }
  }

  validateSumInput(event) {
    //console.log('validateInput ', event);
    const currentInput = event.data;
    this.isInvalidInput = currentInput === null ?
      false
      : !this.validateSum(currentInput);
    if (this.isInvalidInput) {
      this.invalidInputMessage = `Fill the Sum field with a number.`;
    }
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

  saveNewExpence(newExpence) {
    // console.log('newExpence Obj in Post', newExpence);
    this.http.post('http://localhost:3000/expence', {
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
