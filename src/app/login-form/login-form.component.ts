import { Component, OnInit, Input } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as bcrypt from 'bcrypt';

    const saltRounds = 10;
    const myPlaintextPassword = 's0/\/\P4$$w0rD';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  @Input() name: string;
  @Input() mailAddress: string;
  @Input() password: string;

  isButtonPressed = false;
  isExistedUser = false;
  isNewUser = false;

  constructor() { }

  ngOnInit() {
  }

  singIn() {
    this.isButtonPressed = true;
  }

  logIn() {
    this.isButtonPressed = true;
    this.isNewUser = true;
  }

  closeLoginForm() {
    this.isButtonPressed = false;
    this.isNewUser = false;

  }

  onSubmit() {
    
  }


}
