import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { FinanceData } from '../interfaces';

@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.scss']
})
export class ExpenseDetailComponent implements OnInit {

  selectedCategory: string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    const selectedCategory = this.route.snapshot.paramMap.get('category');
    this.selectedCategory = selectedCategory;
    console.log('selectedCategory ', selectedCategory)
    this.connectDataBase();
  }

  connectDataBase() {
    // use for get-request
    this.http.get('http://localhost:3000/expences/' + this.selectedCategory).subscribe((response: FinanceData[]) => {
      console.log('response by category', response);
    });
  }

}
