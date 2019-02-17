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
    // console.log('resp ', response);
    // let categories = this.getExistedCategories(response);
    let categories = response.reduce(function (categories, currentRecord) {
      // console.log('current ', current);
      console.log('obj ', categories);
      if (!categories.includes(currentRecord.type)) {
        categories.push(currentRecord.type);
      }
      return categories;
    }, []);
    console.log(categories);

  }

  getExistedCategories(response) {

  }

}
