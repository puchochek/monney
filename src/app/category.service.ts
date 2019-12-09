import { Injectable, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { Category, LoggedUser } from './interfaces';

import { environment } from './../environments/environment';


@Injectable({
	providedIn: 'root'
})
export class CategoryService {

	constructor(
		private userService: UserService,
		private http: HttpClient,
		private dataService: DataService,


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
			this.upsertCategory(categoryToUpsert);
		}
	}

	upsertCategory(categoryToUpsert: any) {
		const url = `${environment.apiBaseUrl}/category/upsert`;
		const categoryToUpsertBulk = [categoryToUpsert];
		this.http.post(url, {
			categoriesToUpsert: categoryToUpsertBulk
		}, { observe: 'response' })
			.subscribe(
				response => {
					const upsertedCategory = <Category>response.body;
					console.log('---> CATEGORY SERVICE upsertedCategory ', upsertedCategory);
					this.userService.updateUserCategories(<Category[]>response.body);
					this.dataService.updateToken(response.headers.get('Authorization'));
				},
				error => {
					console.log('---> ADD CATEGORY error ', error);
				},
				() => {
					// 'onCompleted' callback.
					// No errors, route to new page here
				}
			);
	}


}
