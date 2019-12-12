import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from '../user.service';


@Component({
	selector: 'app-activate-user',
	templateUrl: './activate-user.component.html',
	styleUrls: ['./activate-user.component.scss']
})
export class ActivateUserComponent implements OnInit {
	constructor(
		private route: ActivatedRoute,
		private userService: UserService
	) { }

	ngOnInit() {
		const token = this.route.snapshot.paramMap.get('token');
		this.userService.activateUser(token);
	}
}
