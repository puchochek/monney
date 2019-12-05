import { Component, OnInit } from '@angular/core';
import { LoggedUser } from './interfaces';
import { DataService } from './data.service';
import { Subscription } from 'rxjs';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Router } from '@angular/router';
import { ThemeService } from './theme.service';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	TITLE = `monney`;

	constructor(
		// private dataService: DataService,
		// private http: HttpClient,
		// public userService: UserService,
		// private router: Router,
		// private themeService: ThemeService,

	) { }

}
