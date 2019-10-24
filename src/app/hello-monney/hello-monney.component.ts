import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';

@Component({
  selector: 'app-hello-monney',
  templateUrl: './hello-monney.component.html',
  styleUrls: ['./hello-monney.component.scss']
})
export class HelloMonneyComponent implements OnInit {

  constructor(
    private http: HttpClient

  ) { }

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    console.log('---> userId HL ', userId);
    console.log('---> token HL ', token);
    //console.log('---> ', JSON.stringify(token), token.toString());
    // if (userId) {
    //   console.log('---> if token');
    //   this.http.get('http://localhost:3000/user/' + userId).subscribe((response: LoggedUser[]) => {
    //     console.log('---> HELLO response ', response);
    //     // this.currentUser = response;
    //     //this.setExpensesByCategory(response);
    //   });

    // }

  }

}
