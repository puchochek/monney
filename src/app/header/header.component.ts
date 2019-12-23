import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	monneyLogoLbl: string = `monney`;
	singInLbl: string = `sing in`;
	singUpLbl: string = `sing up`;
	isUserAuthorised: boolean = false; //hardcoded for now


	constructor() { }

	ngOnInit() {
	}

}
