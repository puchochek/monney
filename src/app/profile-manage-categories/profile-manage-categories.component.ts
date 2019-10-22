import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';
import { Category } from '../interfaces';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AddCategoryModalComponent } from '../add-category-modal/add-category-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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
	allUserCategories: Category[];
	categoriesToDisplay: Category[];
	dialogRef: MatDialogRef<AddCategoryModalComponent>;
	headers: string[];
	pageAmount: number;
	pageNumber: number;
	initialPageNumber: number;
	recordsPerPage: number;
	categoryDisplayFrom: number;
	categoryDisplayTo: number;
	isAscSorted: boolean;
	arePagesToPaginate: boolean;

	//nextDisplayFrom: number;

	constructor(
		private http: HttpClient,
		private dialog: MatDialog,
		private snackBar: MatSnackBar
	) { }

	ngOnInit() {
		this.initialPageNumber = 1;
		this.recordsPerPage = 10;
		this.isAscSorted = false;
		this.greetingMessage = `Hello, ${this.appUser.name}!`;
		this.noCategoriesMessage = `It looks like you don't have any expense categories yet.
		It would be gread to add some to keep your expenses in order.`;
		this.newCategoryBtnLbl = `Add category`;

		if (this.appUser.categories.length != 0) {
			console.log('---> if ', this.appUser.categories);
			this.allUserCategories = this.appUser.categories;
			this.preparePaginationData();
			this.arePagesToPaginate = true;
		} else {
			this.arePagesToPaginate = false;
		}

		this.headers = ['Name', 'Description', 'Action'];
	}

	preparePaginationData() {
		this.arePagesToPaginate = true;
		console.log('---> preparePaginationData');
		let categoriesNumber = this.allUserCategories.length;
		this.pageNumber = this.initialPageNumber;
		if (categoriesNumber <= this.recordsPerPage) {
			this.pageAmount = this.initialPageNumber;
			this.categoriesToDisplay = this.allUserCategories;
			console.log('---> this.categoriesToDisplay ', this.categoriesToDisplay);
		} else {
			this.pageAmount = Math.ceil(categoriesNumber / this.recordsPerPage);
			this.categoryDisplayFrom = 0;
			this.categoryDisplayTo = this.recordsPerPage;
			this.categoriesToDisplay = this.paginateCategories(this.categoryDisplayFrom, this.categoryDisplayTo);
		}
	}

	showPreviouseCategories() {
		this.categoryDisplayFrom = (this.categoryDisplayFrom - this.recordsPerPage) <= 1 ?
			0
			: this.categoryDisplayFrom - this.recordsPerPage;
		this.categoryDisplayTo = this.categoryDisplayFrom + this.recordsPerPage;
		this.updatePageNumber(false);

		this.categoriesToDisplay = this.paginateCategories(this.categoryDisplayFrom, this.categoryDisplayTo);
	}

	showNextCategories() {
		this.categoryDisplayFrom = this.categoryDisplayTo;
		this.categoryDisplayTo = this.categoryDisplayFrom + this.recordsPerPage <= this.allUserCategories.length ?
			this.categoryDisplayFrom + this.recordsPerPage
			: this.allUserCategories.length;
		if (this.categoryDisplayFrom != this.categoryDisplayTo) {
			this.categoriesToDisplay = this.paginateCategories(this.categoryDisplayFrom, this.categoryDisplayTo);
			this.updatePageNumber(true);
		}
	}

	paginateCategories(fromIndex: number, toIndex: number): Category[] {
		console.log('---> paginate ', fromIndex, ' ', toIndex);
		return this.allUserCategories.slice(fromIndex, toIndex);
	}

	updatePageNumber(isNext: boolean) {
		const nextPageNumber = this.pageNumber + 1;
		const prevPageNumber = this.pageNumber - 1;
		if (isNext) {
			if (nextPageNumber <= this.pageAmount) {
				this.pageNumber++
			}
		} else {
			if (prevPageNumber > this.initialPageNumber) {
				this.pageNumber--;
			} else {
				this.pageNumber = this.initialPageNumber;
			}
		}
	}

	openAddCategoryModal(category: any) {
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

	saveNewCategory(categoryToSave: any) {
		if (categoryToSave) {
			if (categoryToSave.name.length !== 0) {
				categoryToSave.isActive = true;
				this.doCategoryControllerCall(categoryToSave);
			}
		}
	}

	deleteCategory(categoryToDel: Category) {
		categoryToDel.isActive = false;
		this.doCategoryControllerCall(categoryToDel);
	}
	//TODO add validation for Categories with the same name
	doCategoryControllerCall(categoryToUpsert: any) {
		let snackMessage: string;
		let action: string;
		this.http.post('http://localhost:3000/category', {
			name: categoryToUpsert.name,
			description: categoryToUpsert.description,
			user: categoryToUpsert.user,
			isActive: categoryToUpsert.isActive,
			id: categoryToUpsert.id
		}).subscribe((result) => {
			if (result) {
				this.status = 'Done';
				snackMessage = this.status;
				action = `OK`;
				this.snackBar.open(snackMessage, action, {
					duration: 5000,
				});
				this.arePagesToPaginate = true;
				//const upsertedCategory = <Category>result;
				this.updateAllUserCategories(<Category>result);
				this.updateCategoriesToDisplay(<Category>result);
			} else {
				this.status = 'error';
				snackMessage = this.status;
				action = `Try again`;
			}
		});
	}

	updateAllUserCategories(upsertedCategory: Category) {
		let existedCategory: Category;
		let filteredCategories: Category[];
		let categories: Category[] = [];

		console.log('---> 1 allUserCategories ', this.allUserCategories);
		if (!this.allUserCategories) {
			console.log('---> categories ', categories);
			categories.push(upsertedCategory);
			this.allUserCategories = categories;
			this.categoriesToDisplay = categories;
			//this.preparePaginationData();
		} else {
			categories = this.allUserCategories;
		}

		if (this.arePagesToPaginate) {
			existedCategory = this.allUserCategories.find(category => category.id === upsertedCategory.id);
			filteredCategories = this.allUserCategories.filter(category => category.id !== upsertedCategory.id);
		}
		if (upsertedCategory.isActive && !existedCategory) {
			categories.unshift(upsertedCategory);
		} else if (upsertedCategory.isActive && existedCategory) {
			existedCategory.description = upsertedCategory.description;
			filteredCategories.unshift(existedCategory);
			categories = filteredCategories;
		} else {
			categories = filteredCategories;
		}
		this.allUserCategories = categories;
		//this.preparePaginationData();
		console.log('---> 1 existedCategory ', existedCategory);
		console.log('---> 1 filteredCategories ', filteredCategories);
		console.log('---> this.allUserCategories', this.allUserCategories);

	}

	updateCategoriesToDisplay(upsertedCategory: Category) {
		console.log('---> 2 allUserCategories ', this.allUserCategories);
		console.log('---> 2 CategoriesToDisplay ', this.categoriesToDisplay);
		if (this.allUserCategories.length === 0) {
			this.arePagesToPaginate = false;
		}
		let displayFromIndex = this.categoryDisplayFrom ?
			this.categoryDisplayFrom
			: 0;
		let displayToIndex = this.categoryDisplayTo ?
			this.categoryDisplayTo
			: this.recordsPerPage;
		console.log('---> 2 this.categoryDisplayFrom ', this.categoryDisplayFrom);
		console.log('---> 2 this.categoryDisplayTo ', this.categoryDisplayTo);
		this.paginateCategories(displayFromIndex, displayToIndex);

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
