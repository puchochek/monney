import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { StorageService } from '../app/storage.service';
import { Category, ApplicationUser } from '../app/interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class CategoryService {
	private readonly category = new BehaviorSubject<Category>(null);
	readonly _category = this.category.asObservable();

	constructor(
		private http: HttpClient,
		private router: Router,
		private storageService: StorageService,
		//private userService: UserService
	) { }

	get upsertedCategory(): Category {
		return this.category.getValue();
	}

	set upsertedCategory(category: Category) {
		this.category.next(category);
	}

	checkIncomeCategory(user: ApplicationUser) {
		if (user.categories.length === 0) {
			const category = {
				name: `Income`,
				description: `Keeps your incomes data.`,
				user: user.id,
				isDeleted: false,
				isIncome: true,
				transactions: []
			}
			this.createCategory(category);
		}
	}

	createCategory(category: Category) {
		const url = `${environment.apiBaseUrl}/category`;
		this.http.post(url,
			category
			, { observe: 'response' })
			.subscribe(
				response => {
					const createdCategory = <Category>response.body;
					console.log('---> CATEGORY createdCategory ', createdCategory);
					this.upsertedCategory = createdCategory;
					this.storageService.updateToken(response.headers.get('Authorization'));
				},
				error => {
					console.log('---> CATEGORY createdCategory error ', error);
				},
				() => {
					// 'onCompleted' callback.
					// No errors, route to new page here
				}
			);
	}

}
