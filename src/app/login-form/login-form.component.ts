import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

const wrongName = `Name field may only consist of letters or numbers.`;
const wrongEmail = `Email field must contain @ symbol.`;
const wrongPassword = `Password must contain 6 or more characters.
Requires at least one upper case letter, one lower case letter and one no-letter character.`;

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
  isValidName: boolean;
  isEmailValid: boolean;
  isPasswordVaild: boolean;
  isFormInvalid: boolean;
  isInvalidInput: boolean;
  invalidInputMessage: string;
  url: string;

  constructor(
    private data: DataService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router, ) { }

  ngOnInit() {
    this.url = this.router.url;
  }

  validateInput() {
    console.log('this.url ', this.url)
    console.log('th', this.url.split('/'));
    //TODO add autorize endpoint 
    const requestParam = this.url.split('/')[1];
    console.log('requestParam ', requestParam);
    this.isValidName = this.validateName(this.name);
    this.isEmailValid = this.validateEmail(this.mailAddress);
    this.isPasswordVaild = this.validatePassword(this.password);

    if (this.isValidName && this.isEmailValid && this.isPasswordVaild) {
      this.login();
    } else {
      this.disableLoginButton();
      this.isInvalidInput = true;
      this.invalidInputMessage = this.setErrorMessage(this.isValidName, this.isEmailValid, this.isPasswordVaild);
    }
  }

  setErrorMessage(nameInput: boolean, emailInput: boolean, passwordInput: boolean): string {
    let invalidInputMessage: string;

    if (!nameInput && !emailInput && !passwordInput) {
      this.clearWrongInput(['name', 'email', 'password']);
      invalidInputMessage = wrongName + ' ' + wrongEmail + ' ' + wrongPassword;
    } else if (!nameInput && !passwordInput) {
      this.clearWrongInput(['name', 'password']);
      invalidInputMessage = wrongName + ' ' + wrongPassword;
    } else if (!emailInput && !passwordInput) {
      this.clearWrongInput(['email', 'password']);
      invalidInputMessage = wrongEmail + ' ' + wrongPassword;
    } else if (!nameInput && !emailInput) {
      this.clearWrongInput(['name', 'email']);
      invalidInputMessage = wrongName + ' ' + wrongEmail;
    } else if (!nameInput) {
      this.clearWrongInput(['name']);
      invalidInputMessage = wrongName;
    } else if (!emailInput) {
      this.clearWrongInput(['email']);
      invalidInputMessage = wrongEmail;
    } else if (!passwordInput) {
      this.clearWrongInput(['password']);
      invalidInputMessage = wrongPassword;
    } else {
      invalidInputMessage = `Something is wron, but I don't know what exactly.`;
    }

    return invalidInputMessage;
  }

  clearWrongInput(wrongInputs: string[]) {
    console.log('wrongInput ', wrongInputs);
    wrongInputs.forEach(wrongInput => {
      switch (wrongInput) {
        case 'name':
          this.name = '';
        case 'email':
          this.mailAddress = '';
        case 'password':
          this.password = '';
      }
    });

  }

  validateName(nameInput: string) {
    // allows lowercase and one uppercase letters and numbers
    const expression = /^([- A-Za-zа-яА-ЯёЁ0-9]+)$/;
    if (expression.test(String(nameInput).toLowerCase()) || nameInput.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  validateEmail(emailInput: string): boolean {
    const expression = /\S+@\S+/;
    return expression.test(String(emailInput).toLowerCase()) ? true : false;
  }

  disableLoginButton() {
    this.isFormInvalid = true;
  }

  validatePassword(passwordInput: string): boolean {
    console.log('passwordInput ', passwordInput);
    // at least one number, one lowercase and one uppercase letter
    // at least six characters
    //const expression = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    //const expression = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    const expression = /^[A-Za-z]\w{7,15}$/;
    console.log(expression.test(String(passwordInput).toLowerCase()));
    return expression.test(String(passwordInput).toLowerCase()) ? true : false;

  }

  login() {
    // TODO add validation for all params
    console.log('password', this.password);
    this.http.post('http://localhost:3000/user/login', {
      password: this.password,
      name: this.name,
      email: this.mailAddress
    }).subscribe((result) => {
      console.log('result ', result);
      // TODO add modal message
      // if (result) {
      //   this.status = 'saved';
      // } else {
      //   this.status = 'error';
      // }
      this.router.navigate(['/categories']);
    });
  }

  hideMessage() {
    this.isFormInvalid = false;
    this.isInvalidInput = false;
  }



}
