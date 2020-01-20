import { Injectable } from '@angular/core';
import { ApplicationUser, Category, Transaction, StorageUser } from './interfaces';
import { LoginUser } from './interfaces';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { StorageService } from '../app/storage.service';
import { CategoryService } from '../app/category.service';
import { Subscription } from 'rxjs';
import { FileUploadModule } from "ng2-file-upload";
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private readonly user = new BehaviorSubject<ApplicationUser>(null);
	readonly _user = this.user.asObservable();

	private readonly selfRegistredUserStatus = new BehaviorSubject<string>(null);
	readonly _selfRegistredUserStatus = this.selfRegistredUserStatus.asObservable();

	userBaseUrl: string = `${environment.apiBaseUrl}/user`;
	public uploader: FileUploader;

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

	get createdUserStatus(): string {
		return this.selfRegistredUserStatus.getValue();
	}

	set createdUserStatus(selfRegistredUserStatus:  string) {
		this.selfRegistredUserStatus.next(selfRegistredUserStatus);
	}

	createSelfRegistredUser(user: ApplicationUser) {
		const requestUrl = `${this.userBaseUrl}/singin`;
		this.http.post(requestUrl, user, { observe: 'response' }
		).subscribe(
			response => {
				console.log('---> login response ', response);
				this.createdUserStatus = `success`;
			},
			error => {
				console.log('---> user login error ', error);
				this.createdUserStatus = error.error.message;
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);
	}

	loginSelfRegistredUser(loginUser: LoginUser) {
		const requestUrl = `${this.userBaseUrl}/singup`;
		this.http.post(requestUrl, {
			password: loginUser.password,
			email: loginUser.email
		}, { observe: 'response' }
		).subscribe(
			response => {
				this.appUser = <ApplicationUser>response.body;
				this.refreshUserToken(this.appUser.id)
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
						if (response.body) {
							const currentUser = <ApplicationUser>response.body;
							currentUser.incomeCategory = this.getIncomeCategory(currentUser);
							currentUser.expensesCategories = currentUser.categories.length ? this.getExpensesCategories(currentUser.incomeCategory.id, currentUser) : [];
							this.appUser = currentUser;
							this.storageService.updateToken(response.headers.get('Authorization'));
							this.storageService.updateStorageUser(this.appUser);
							console.log('---> USER SERVICE response ', response);
						}
					},
					error => {
						console.log('---> USER SERVICE error ', error);
					},
					() => {
						// 'onCompleted' callback.
						// No errors, route to new page here
					}
				);
		}
	}

	refreshUserToken(id: string) {
		this.http.post(`${this.userBaseUrl}/token`, {
			id: id
		}, { observe: 'response' }
		).subscribe(response => {
			if (response) {
				this.storageService.updateToken(response.headers.get('Authorization'));
			} else {
				// TODO add error modal
			}
		});
	}

	updateUser(user: ApplicationUser) {
		this.http.patch(this.userBaseUrl, user, { observe: 'response' })
			.subscribe(
				response => {
					this.appUser = <ApplicationUser>response.body;
					console.log('---> USER updatedUser ', this.appUser);
					this.storageService.updateToken(response.headers.get('Authorization'));
				},
				error => {
					console.log('---> USER updatedUser error ', error);
				},
				() => {
					// 'onCompleted' callback.
					// No errors, route to new page here
				}
			);
	}

	getIncomeCategory(user: ApplicationUser): Category {

		return user.categories.find(category => category.name === `Income`);
	}

	getExpensesCategories(incomeId: string, user: ApplicationUser): Category[] {

		return user.categories.filter(category => category.id !== incomeId);
	}

	updateUserCategories(createdCategory: Category, userToUpdate: ApplicationUser) {
		const currentCategories = userToUpdate.categories;
		currentCategories.push(createdCategory);
		this.appUser = userToUpdate;
	}

	updateUserTransactions(upsertedTransaction: Transaction, userToUpdate: ApplicationUser) {
		const currentTransactions = [...userToUpdate.transactions];
		let existedTransaction: Transaction;
		let updatedTransactions: Transaction[];
		if (currentTransactions.length) {
			const thisIdTransactions = currentTransactions.filter(transition => transition.id === upsertedTransaction.id);
			if (thisIdTransactions.length) {
				existedTransaction = thisIdTransactions[0];
			}
		}
		if (existedTransaction) {
			updatedTransactions = currentTransactions.reduce((transactionsList, transaction) => {
				if (transaction.id === existedTransaction.id) {
					transactionsList.push(existedTransaction);
				} else {
					transactionsList.push(transaction);
				}
				return transactionsList;
			}, []);
		} else {
			updatedTransactions = [...currentTransactions, upsertedTransaction];
		}
		userToUpdate.transactions = updatedTransactions;
		this.appUser = userToUpdate;
	}
}
