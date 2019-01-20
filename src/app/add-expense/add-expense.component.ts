import { Component, OnInit, Input } from '@angular/core';
import { Category } from '../category';
import { DataService } from "../data.service";


@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss'],
  providers: []
})
export class AddExpenseComponent implements OnInit {

  @Input() category: Category;

  sum: number;
  comment: string;
  dateToSave: string;

  constructor(private data: DataService) { }

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
    console.log(this.sum, this.comment, this.category.name, this.dateToSave);
  }

}
