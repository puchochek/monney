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
	categories: Category[];
	categoriesToDisplay: Category[];
	dialogRef: MatDialogRef<AddCategoryModalComponent>;
	headers: string[];
	pageAmount: number;
	pageNumber: number;
	recordsPerPage: number;
	categoryDisplayFrom: number;
	categoryDisplayTo: number;
	isAscSorted: boolean;

	constructor(
		private http: HttpClient,
		private dialog: MatDialog,
		private snackBar: MatSnackBar
	) { }

	ngOnInit() {
		this.recordsPerPage = 10;
		this.isAscSorted = false;
		this.greetingMessage = `Hello, ${this.appUser.name}!`;
		this.noCategoriesMessage = `It looks like you don't have any expense categories yet.
		It would be gread to add some to keep your expenses in order.`;
		this.newCategoryBtnLbl = `Add category`;

		this.categories = this.appUser.categories.length > 0 ?
			this.appUser.categories
			: null;
		this.preparePaginationData(this.categories);
		this.headers = ['Name', 'Description', 'Action'];
	}

	preparePaginationData(categories: Category[]) {
		const categoriesNumber = categories.length;
		this.pageNumber = 1;
		if (categoriesNumber <= this.recordsPerPage) {
			this.pageAmount = 1;
			this.categoriesToDisplay = categories;
			document.getElementById('left-pagination').style.pointerEvents = 'none';
			document.getElementById('right-pagination').style.pointerEvents = 'none';
		} else {
			document.getElementById('left-pagination').style.pointerEvents = 'none';
			this.pageAmount = Math.ceil(categoriesNumber / this.recordsPerPage);
			this.categoryDisplayFrom = 0;
			this.categoryDisplayTo = this.recordsPerPage;
			this.categoriesToDisplay = this.paginateCategories(this.categoryDisplayFrom, this.categoryDisplayTo);
		}
	}

	showPreviouseCategories() {
		document.getElementById('right-pagination').style.pointerEvents = 'auto';

		this.categoryDisplayFrom = this.categoryDisplayFrom - this.recordsPerPage;
		this.categoryDisplayTo = this.categoryDisplayFrom + this.recordsPerPage;
		this.categoriesToDisplay = this.paginateCategories(this.categoryDisplayFrom, this.categoryDisplayTo);
		this.pageNumber --;
		if (this.categoryDisplayFrom <= 0) {
			document.getElementById('left-pagination').style.pointerEvents = 'none';
		}
	}

	showNextCategories() {
		document.getElementById('left-pagination').style.pointerEvents = 'auto';

		this.categoryDisplayFrom = this.categoryDisplayTo;
		this.categoryDisplayTo = this.categoryDisplayFrom + this.recordsPerPage;
		this.categoriesToDisplay = this.paginateCategories(this.categoryDisplayFrom, this.categoryDisplayTo);
		this.pageNumber ++;
		if (this.categoryDisplayTo > this.categories.length) {
			document.getElementById('right-pagination').style.pointerEvents = 'none';
		}
	}

	paginateCategories(fromIndex: number, toIndex: number): Category[] {
		return this.categories.slice(fromIndex, toIndex);
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
				const upsertedCategory = <Category>result;
				let existedCategory: Category;
				let filteredCategories: Category[];
				if (this.categories) {
					existedCategory = this.categories.find(category => category.id === upsertedCategory.id);
					filteredCategories = this.categories.filter(category => category.id !== upsertedCategory.id);
				}
				if (upsertedCategory.isActive && !existedCategory) {
					this.categories.unshift(upsertedCategory);
				} else if (upsertedCategory.isActive && existedCategory) {
					existedCategory.description = upsertedCategory.description;
					filteredCategories.unshift(existedCategory);
					this.categories = filteredCategories;
				} else {
					this.categories = filteredCategories;
				}
			} else {
				this.status = 'error';
				snackMessage = this.status;
				action = `Try again`;
			}
		});
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
