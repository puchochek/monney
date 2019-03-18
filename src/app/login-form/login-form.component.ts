import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// import * as CryptoJS from 'crypto-js';
// import * as bcrypt from 'bcrypt';

//     const saltRounds = 10;
//     const myPlaintextPassword = 's0/\/\P4$$w0rD';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  @Input() name: string;
  @Input() mailAddress: string;
  @Input() password: string;

  status: string;

  constructor(
    private data: DataService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,) { }

  ngOnInit() {
  }

  login() {
    let test = 'login';
    console.log('password', this.password);
    this.http.post('http://localhost:3000/expences/login', {
      password: this.password,
    }).subscribe((result) => {
      console.log('result ', result);
      if (result) {
        this.status = 'saved';
      } else {
        this.status = 'error';
      }
      this.router.navigate(['/categories']);
    });
  }



}
