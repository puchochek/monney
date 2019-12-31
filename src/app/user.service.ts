import { Injectable } from '@angular/core';
import { ApplicationUser, Category } from './interfaces';
import { LoginUser } from './interfaces';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { StorageService } from '../app/storage.service';
import { CategoryService } from '../app/category.service';
import { Subscription } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private readonly user = new BehaviorSubject<ApplicationUser>(null);
	readonly _user = this.user.asObservable();

	userBaseUrl: string = `${environment.apiBaseUrl}/user`;

	constructor(
		private http: HttpClient,
		private router: Router,
		private storageService: StorageService,
		private categoryService: CategoryService,
	) { }

	get appUser(): ApplicationUser {
		return this.user.getValue();
	}

	set appUser(user: ApplicationUser) {
		this.user.next(user);
	}

	createSelfRegistredUser(user: ApplicationUser) {
		const requestUrl = `${this.userBaseUrl}/singin`;
		this.http.post(requestUrl, user, { observe: 'response' }
		).subscribe(
			response => {
				console.log('---> login response ', response);
			},
			error => {
				console.log('---> user login error ', error);
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);
	}

	loginSelfRegistredUser(loginUser: LoginUser) {
		console.log('---> loginSelfRegistredUser ');
		const requestUrl = `${this.userBaseUrl}/singup`;
		this.http.post(requestUrl, {
			password: loginUser.password,
			email: loginUser.email
		}, { observe: 'response' }
		).subscribe(
			response => {
				this.appUser = <ApplicationUser>response.body;
				this.storageService.updateToken(response.headers.get('Authorization'));
				this.router.navigate(['/home']);
			},
			error => {
				console.log('---> login error ', error);
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);

	}

	authoriseWithGoogle() {
		this.router.navigate(['/externalRedirect', { externalUrl: `${environment.apiBaseUrl}/oauth/google` }], {
			skipLocationChange: true,
		});
	}

	activateUser(token: string) {
		this.http.post(`${this.userBaseUrl}/activate`, {
			token: token,
		}).subscribe((response: ApplicationUser) => {
			console.log('---> activateUser result ', response);
			if (response) {
				const bearerToken = `Bearer ${token}`;
				this.storageService.updateToken(bearerToken);
				this.router.navigate(['/home']);
			} else {
				// TODO add error modal
			}
		});
	}

	getUserByToken() {
		if (localStorage.getItem('token')) {
			this.http.get(this.userBaseUrl, { observe: 'response' })
				.subscribe(
					response => {
						this.appUser = <ApplicationUser>response.body;
						this.storageService.updateToken(response.headers.get('Authorization'));
						console.log('---> USER SERVICE response ', response);
					},
					error => {
						console.log('---> USER SERVICE error ', error);
						//this.router.navigate(['/hello-monney']);
					},
					() => {
						// 'onCompleted' callback.
						// No errors, route to new page here
					}
				);
		}
	}

	updateUserCategories(createdCategory: Category, userToUpdate: ApplicationUser) {
		const currentCategories = userToUpdate.categories;
		currentCategories.push(createdCategory);
		this.appUser = userToUpdate;
	}
}
