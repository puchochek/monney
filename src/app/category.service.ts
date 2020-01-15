import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { StorageService } from '../app/storage.service';
import { Category, ApplicationUser, Transaction } from '../app/interfaces';
import { BehaviorSubject } from 'rxjs';
import { TransactionComponent } from './transaction/transaction.component';

@Injectable({
	providedIn: 'root'
})
export class CategoryService {
	private readonly category = new BehaviorSubject<Category>(null);
	readonly _category = this.category.asObservable();

	private readonly failedDategory = new BehaviorSubject<Category>(null);
	readonly _failedDategory = this.failedDategory.asObservable();

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

	get unsavedCategory(): Category {
		return this.failedDategory.getValue();
	}

	set unsavedCategory(failedDategory: Category) {
		this.failedDategory.next(failedDategory);
	}

	getCategoryByName(user: ApplicationUser, categoryName: string): Category {
		let currentCategory: Category;
		if (user.categories.length) {
			currentCategory = user.categories.filter(category => category.name === categoryName)[0];
		}

		return currentCategory;
	}

	setCategoriesTotal(categories: Category[], user: ApplicationUser): Category[] {
		const categoriesWithTotal: Category[] = categories.reduce((categoriesList, category) => {
			if (user.transactions.length) {
				const currentUserTransactions = [...user.transactions];
				const thisCategoryTransactions = currentUserTransactions.filter(transaction => transaction.category === category.id && !transaction.isDeleted);
				if (thisCategoryTransactions.length) {
					const thisMonthTransactions = this.getThisMonthTransactions(thisCategoryTransactions);
					category.total = thisMonthTransactions.reduce((transactionsSumTotal, currentTransaction) => transactionsSumTotal + currentTransaction.sum, 0);
				} else {
					category.total = 0;
				}
			} else {
				category.total = 0;
			}
			categoriesList.push(category);
			return categoriesList;
		}, []);

		return categoriesWithTotal;
	}

	getThisMonthTransactions(transactions: Transaction[]): Transaction[] {
		const currentMonth = new Date().getMonth();

		return transactions.filter(transaction => new Date(transaction.date).getMonth() === currentMonth);
	}

	setCategoriesLast(categories: Category[], user: ApplicationUser): Category[] {
		const categoriesWithLast: Category[] = categories.reduce((categoriesList, category) => {
			if (user.transactions.length) {
				const currentUserTransactions = [...user.transactions];
				const thisCategoryTransactions = currentUserTransactions.filter(transaction => transaction.category === category.id && !transaction.isDeleted);
				if (thisCategoryTransactions.length) {
					const thisCategoryTransactionsSorted = this.sortCategoryTransactionsByDate(thisCategoryTransactions);
					const categoryLastTransaction = thisCategoryTransactionsSorted[0];
					category.lastTransaction = Number(categoryLastTransaction.sum);
				} else {
					category.lastTransaction = 0;
				}
			} else {
				category.lastTransaction = 0;
			}
			categoriesList.push(category);
			return categoriesList;
		}, []);

		return categoriesWithLast;
	}

	sortCategoryTransactionsByDate(currentCategoryTransactions: Transaction[]) {
		const sortedTransactions: Transaction[] = currentCategoryTransactions.sort(function compare(a, b) {
			return (new Date(b.date) as any) - (new Date(a.date) as any);
		});

		return sortedTransactions;
	}

	sortCategories(categories: Category[], sortByFlag: string): Category[] {
		const sortByDateFlag = `date`;
		const sortByNameFlag = `name`;
		const sortBySumFlag = `sum`;
		let sortedCategories: Category[];
		switch (sortByFlag) {
			case sortByDateFlag:
				sortedCategories = this.sortCategoriesByDate(categories);
				break;
			case sortByNameFlag:
				sortedCategories = this.sortCategoriesByName(categories);
				break;
			case sortBySumFlag:
				sortedCategories = this.sortCategoriesBySum(categories);
				break;
		}

		return sortedCategories;
	}

	sortCategoriesByDate(categories: Category[]): Category[] {
		const sortedCategories: Category[] = categories.sort(function compare(a, b) {
			return (new Date(b.updatedAt) as any) - (new Date(a.updatedAt) as any);
		});

		return sortedCategories;
	}

	sortCategoriesByName(categories: Category[]): Category[] {
		const sortedCategories: Category[] = categories.sort(function (a, b) {
			var nameA = a.name.toUpperCase();
			var nameB = b.name.toUpperCase();
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}
		});

		return sortedCategories;
	}

	sortCategoriesBySum(categories: Category[]): Category[] {
		const sortedCategories: Category[] = categories.sort(function (a, b) {
			return Number(b.total) - Number(a.total);
		});

		return sortedCategories;
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
					if (this.upsertedCategory.name !== `Income`) {
						this.router.navigate(['/home']);
					}
				},
				error => {
					console.log('---> CATEGORY createdCategory error ', error);
					this.unsavedCategory = category;
				},
				() => {
					// 'onCompleted' callback.
					// No errors, route to new page here
				}
			);
	}

	updateCategory(categoryToUpdate: Category) {
		const url = `${environment.apiBaseUrl}/category`;
		this.http.patch(url, categoryToUpdate, { observe: 'response' })
			.subscribe(
				response => {
					const upsertedCategory = <Category>response.body;
					console.log('---> CATEGORY updatedCategory ', upsertedCategory);
					this.upsertedCategory = upsertedCategory;
					this.storageService.updateToken(response.headers.get('Authorization'));
					if (this.upsertedCategory.name !== `Income`) {
						this.router.navigate(['/home']);
					}
				},
				error => {
					console.log('--->CATEGORY updatedCategory error ', error);
					this.unsavedCategory = categoryToUpdate;
				},
				() => {
					// 'onCompleted' callback.
					// No errors, route to new page here
				}
			);
	}

}
