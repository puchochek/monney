import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';
import { Category } from '../interfaces';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AddCategoryModalComponent } from '../add-category-modal/add-category-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../data.service';
import { environment } from '../../environments/environment'

@Component({
	selector: 'app-profile-manage-categories',
	templateUrl: './profile-manage-categories.component.html',
	styleUrls: ['./profile-manage-categories.component.scss']
})
export class ProfileManageCategoriesComponent implements OnInit {
	@Input() appUser: LoggedUser;

	greetingMessage: string;
	noCategoriesMessage: string;
	newCategoryBtnLbl: string;
	status: string;
	allUserCategories: Category[] = [];
	categoriesToDisplay: Category[] = [];
	dialogRef: MatDialogRef<AddCategoryModalComponent>;
	headers: string[] = [];
	pageAmount: number;
	pageNumber: number;
	initialPageNumber: number;
	recordsPerPage: number;
	categoryDisplayFrom: number;
	categoryDisplayTo: number;
	isAscSorted: boolean;
	arePagesToPaginate: boolean;
	userCategoriesByKeys: any[] = [];

	constructor(
		private http: HttpClient,
		private dialog: MatDialog,
		private snackBar: MatSnackBar,
		private dataService: DataService,
	) { }

	ngOnInit() {
		this.initialPageNumber = 1;
		this.recordsPerPage = 10;
		this.isAscSorted = false;
		this.greetingMessage = `Hello, ${this.appUser.name}!`;
		this.noCategoriesMessage = `It looks like you don't have any expense categories yet.
		It would be gread to add some to keep your expenses in order.`;
		this.newCategoryBtnLbl = `add category`;

		if (this.appUser.categories.length != 0) {
			this.allUserCategories = this.appUser.categories.filter(category => !category.isIncome);
			this.preparePaginationData();
			this.arePagesToPaginate = true;
		} else {
			this.arePagesToPaginate = false;
		}

		this.headers = ['Name', 'Description', 'Action'];
	}

	preparePaginationData() {
		const categoriesToHandle = this.allUserCategories;
		let categoriesNumber = categoriesToHandle.length;
		this.pageAmount = Math.ceil(categoriesNumber / this.recordsPerPage);
		if (this.pageNumber) {
			if (this.pageNumber > this.pageAmount) {
				this.pageNumber = this.pageNumber - 1;
			}
		} else {
			this.pageNumber = 1;
		}
		let startIndex: number = 0;
		let endIndex: number = 10;
		let categoriesByKeys: any[] = [];
		for (let i = 1; i <= this.pageAmount; i++) {
			const categoriesPack = categoriesToHandle.slice(startIndex, endIndex);
			const categoriesPackByIndex = { pageIndex: i, categoriesPerPage: categoriesPack };
			categoriesByKeys.push(categoriesPackByIndex);
			startIndex = startIndex + 10;
			endIndex = endIndex + 10;
		}
		if (categoriesByKeys.length === 0) {
			this.arePagesToPaginate = false;
		} else {
			this.arePagesToPaginate = true;
			const currentPageCategories = categoriesByKeys.find(categoryByKeys => categoryByKeys.pageIndex === this.pageNumber)
			this.categoriesToDisplay = [...currentPageCategories.categoriesPerPage];
			this.userCategoriesByKeys = categoriesByKeys;
		}
	}

	showPreviouseCategories() {
		const previousPageNumber = this.pageNumber - 1;
		if (previousPageNumber > 0) {
			this.pageNumber--;
		}
		this.preparePaginationData();
	}

	showNextCategories() {
		const nextPageNumber = this.pageNumber + 1;
		if (nextPageNumber <= this.pageAmount) {
			this.pageNumber++;
		}
		this.preparePaginationData();
	}

	openEditCategoryModal(category: any) {
		const categoryFormId = category ? category.id : undefined;
		this.dialogRef = this.dialog.open(AddCategoryModalComponent, {
			data: {
				category: category
			}
		});
		this.dialogRef
			.afterClosed()
			.subscribe(categoryForm => {
				let categoryToSave;
				if (categoryForm) {
					categoryToSave = {
						name: categoryForm.name,
						description: categoryForm.description,
						user: this.appUser.id,
						id: categoryFormId
					};
				}
				this.saveNewCategory(categoryToSave);
			});
	}

	openAddCategoryModal() {
		this.dialogRef = this.dialog.open(AddCategoryModalComponent);
		this.dialogRef
			.afterClosed()
			//TODO save category by name
			.subscribe(name => console.log('---> name ', name ));
	}

	saveNewCategory(categoryToSave: any) {
		if (categoryToSave) {
			if (categoryToSave.name.length !== 0) {
				categoryToSave.isActive = true;
				this.upsertCategory(categoryToSave);
			}
		}
	}

	deleteCategory(categoryToDel: Category) {
		categoryToDel.isActive = false;
		this.upsertCategory(categoryToDel);
	}

	//TODO add validation for Categories with the same name
	upsertCategory(categoryToUpsert: any) {
		let snackMessage: string;
		let action: string;
		const url = `${environment.apiBaseUrl}/category/upsert`;
		this.http.post(url, {
			name: categoryToUpsert.name,
			description: categoryToUpsert.description,
			user: categoryToUpsert.user,
			isActive: categoryToUpsert.isActive,
			id: categoryToUpsert.id,
		}, { observe: 'response' })
		.subscribe(
			response => {
				this.status = 'Done';
				snackMessage = this.status;
				action = `OK`;
				this.snackBar.open(snackMessage, action, {
					duration: 5000,
				});
				const upsertedCategory = <Category>response.body;
				if (this.allUserCategories.length === 0) {
					this.allUserCategories.push(upsertedCategory);
					this.preparePaginationData();
				} else {
					this.updateAllUserCategories(upsertedCategory);
				}
				this.dataService.updateToken(response.headers.get('Authorization'));
			},
			error => {
				console.log('---> PROFILE MANAGE CATEGORIES error ', error);
				this.status = 'error';
				snackMessage = this.status;
				action = `Try again`;
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);
	}

	updateAllUserCategories(upsertedCategory: Category) {
		let existedCategory: Category;
		let filteredCategories: Category[];
		let userCategories: Category[] = [];
		let displayedCategoriesActual = [...this.categoriesToDisplay];
		let displayedCategoriesUpdated = [...displayedCategoriesActual];

		if (!this.allUserCategories) {
			userCategories.unshift(upsertedCategory);
			this.allUserCategories = [...userCategories];
			this.preparePaginationData();
		} else {
			userCategories = [...this.allUserCategories];
			displayedCategoriesUpdated = [...this.categoriesToDisplay];
		}

		existedCategory = userCategories.find(category => category.id === upsertedCategory.id);
		filteredCategories = displayedCategoriesUpdated.filter(category => category.id !== upsertedCategory.id);

		if (upsertedCategory.isActive && !existedCategory) {
			displayedCategoriesUpdated.unshift(upsertedCategory);
		} else if (upsertedCategory.isActive && existedCategory) {
			existedCategory = { ...upsertedCategory };
			displayedCategoriesUpdated = [...filteredCategories];
			displayedCategoriesUpdated.unshift(existedCategory);
		} else {
			if (filteredCategories.length === 0) {
				displayedCategoriesUpdated = [];
			} else {
				displayedCategoriesUpdated = [...filteredCategories];
			}
		}
		let allUserCategoriesUpdated: Category[] = [];
		this.userCategoriesByKeys.forEach(categoryiesPack => {
			if (categoryiesPack.pageIndex === this.pageNumber) {
				categoryiesPack.categoriesPerPage = displayedCategoriesUpdated;
			}
			allUserCategoriesUpdated = [...allUserCategoriesUpdated, ...categoryiesPack.categoriesPerPage]
		});
		this.allUserCategories = [...allUserCategoriesUpdated];
		if (this.allUserCategories.length != 0) {
			this.arePagesToPaginate = true;
		}
		this.preparePaginationData();
	}

	sortCategoriesByName() {
		if (this.isAscSorted) {
			this.categoriesToDisplay.sort(function (a, b) {
				if (a.name < b.name) { return 1; }
				if (a.name > b.name) { return -1; }
				return 0;
			});
			this.isAscSorted = false;

		} else {
			this.categoriesToDisplay.sort(function (a, b) {
				if (a.name < b.name) { return -1; }
				if (a.name > b.name) { return 1; }
				return 0;
			});
			this.isAscSorted = true;
		}
	}
}
