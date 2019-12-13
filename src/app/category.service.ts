import { Injectable, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { Category, LoggedUser } from './interfaces';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { environment } from './../environments/environment';
import { SpinnerService } from './spinner.service';
import { SnackBarService } from './snack-bar.service';

@Injectable({
	providedIn: 'root'
})
export class CategoryService {

	constructor(
		private userService: UserService,
		private http: HttpClient,
		private dataService: DataService,
		private router: Router,
		private spinnerService: SpinnerService,
		private snackBarService: SnackBarService
	) { }

	checkIncomeCategory() {
		const currentUser = { ...this.userService.appUser };
		if (currentUser.categories.length === 0) {
			const categoryToUpsert = {
				name: `Income`,
				description: `Keeps your incomes data.`,
				user: currentUser.id,
				isActive: true,
				isIncome: true
			}
			this.createCategory(categoryToUpsert, '');
		}
	}

	createCategory(category: any, navigateLink: string) {
		this.spinnerService.isLoading = true;
		const url = `${environment.apiBaseUrl}/category`;
		this.http.post(url,
			category
			, { observe: 'response' })
			.subscribe(
				response => {
					const createdCategories = <Category[]>response.body;
					console.log('---> CATEGORY createdCategory ', createdCategories);
					this.userService.updateUserCategories(createdCategories);
					this.dataService.updateToken(response.headers.get('Authorization'));
					if (navigateLink.length !== 0) {
						this.router.navigate([`${navigateLink}`]);
					}
					this.spinnerService.isLoading = false;
					const createdCategoryName = createdCategories[0].name;
					if (createdCategoryName !== `Income`) {
						this.snackBarService.snackBarMessage = `${createdCategoryName} category created`;
					}
				},
				error => {
					console.log('---> CATEGORY createdCategory error ', error);
					this.spinnerService.isLoading = false;
					this.snackBarService.snackBarMessage = `Oops! ${error.error.message}`;
				},
				() => {
					// 'onCompleted' callback.
					// No errors, route to new page here
				}
			);
	}

	updateCategory(categoriesToUpdate: Category[], navigateLink: string) {
		this.spinnerService.isLoading = true;
		const url = `${environment.apiBaseUrl}/category`;
		this.http.patch(url, categoriesToUpdate, { observe: 'response' })
			.subscribe(
				response => {
					const upsertedCategory = <Category[]>response.body;
					console.log('---> CATEGORY updatedCategory ', upsertedCategory);
					this.userService.updateUserCategories(upsertedCategory);
					this.dataService.updateToken(response.headers.get('Authorization'));
					if (navigateLink.length !== 0) {
						this.router.navigate([`${navigateLink}`]);
					}
					this.spinnerService.isLoading = false;
					this.snackBarService.snackBarMessage = `${upsertedCategory[0].name} category updated.`;
				},
				error => {
					console.log('--->CATEGORY updatedCategory error ', error);
					this.spinnerService.isLoading = false;
					this.snackBarService.snackBarMessage = `Oops! ${error.error.message}`;
				},
				() => {
					// 'onCompleted' callback.
					// No errors, route to new page here
				}
			);
	}

	deleteCategory(categoryToDelete: any, navigateLink: string) {
		this.spinnerService.isLoading = true;
		const url = `${environment.apiBaseUrl}/category/${categoryToDelete.name}`;
		this.http.delete(url, { observe: 'response' })
			.subscribe(
				response => {
					console.log('---> CATEGORY deleteCategory ', response);
					const deletedCategory = <Category>response.body;
					this.userService.updateUserCategories([deletedCategory]);
					this.dataService.updateToken(response.headers.get('Authorization'));
					if (navigateLink.length !== 0) {
						this.router.navigate([`${navigateLink}`]);
					}
					this.spinnerService.isLoading = false;
					this.snackBarService.snackBarMessage = `${deletedCategory[0].name} category deleted.`;
				},
				error => {
					console.log('---> CATEGORY deleteCategory error ', error);
					this.spinnerService.isLoading = false;
					this.snackBarService.snackBarMessage = `Oops! ${error.error.message}`;
				},
				() => {
					// 'onCompleted' callback.
					// No errors, route to new page here
				}
			);
	}


}
