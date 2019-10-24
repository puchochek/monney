import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';
import { Router } from '@angular/router';

@Component({
	selector: 'app-hello-monney',
	templateUrl: './hello-monney.component.html',
	styleUrls: ['./hello-monney.component.scss']
})
export class HelloMonneyComponent implements OnInit {

	constructor(
		private http: HttpClient,
		private router: Router,

	) { }

	ngOnInit() {
		const userId = localStorage.getItem('userId');
		const token = localStorage.getItem('token');
		console.log('---> HELLO-MONNEY', token);
		//TODO How to avoid blinking????
		if (token) {
			this.http.get('http://localhost:3000/user/user-by-id/' + userId).subscribe((response: LoggedUser) => {
				if (response) {
					this.router.navigate(['/myprofile/' + response.id]);
				}
			});
		}
	}

}
