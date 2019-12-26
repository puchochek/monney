import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

	constructor(
		private route: ActivatedRoute,
		private userService: UserService,
	) { }

	ngOnInit() {
		const token = this.route.snapshot.paramMap.get('token');
		console.log('---> token ', token);
		if (token) {
			this.userService.activateUser(token);
		}
	}
}
