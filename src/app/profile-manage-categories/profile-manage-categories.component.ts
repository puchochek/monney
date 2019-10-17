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
	dialogRef: MatDialogRef<AddCategoryModalComponent>;
	headers: string[];

	constructor(
		private http: HttpClient,
		private dialog: MatDialog,
		private snackBar: MatSnackBar
	) { }

	ngOnInit() {
		this.greetingMessage = `Hello, ${this.appUser.name}!`;
		this.noCategoriesMessage = `It looks like you don't have any expense categories yet.
		It would be gread to add some to keep your expenses in order.`;
		this.newCategoryBtnLbl = `Add category`;

		this.categories = this.appUser.categories.length > 0 ?
			this.appUser.categories
			: null;
		this.headers = ['Name', 'Description', 'Action'];
	}

	openAddCategoryModal(category: any) {
		this.dialogRef = this.dialog.open(AddCategoryModalComponent, {
			data: {
				category: category
			}
		});
		this.dialogRef
			.afterClosed()
			.subscribe(categoryForm => {
				const categoryToSave = {
					name: categoryForm.name,
					description: categoryForm.description,
					user: this.appUser.id
				};
				this.saveNewCategory(categoryToSave);
			});
	}

	saveNewCategory(categoryToSave: any) {
		if (categoryToSave.name.length !== 0) {
			categoryToSave.isActive = true;
			this.doCategoryControllerCall(categoryToSave);
		}
	}

	updareCategory(categoryToUpdate: Category) {
		console.log('---> categoryToUpdate ', categoryToUpdate);
		this.doCategoryControllerCall(categoryToUpdate);

	}

	deleteCategory(categoryToDel: Category) {
		categoryToDel.isActive = false;
		this.doCategoryControllerCall(categoryToDel);

	}

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
			console.log('---> UPSERTED CATEGORY ', result);
			if (result) {
				this.status = 'Done';
				snackMessage = this.status;
				action = `OK`;
				this.snackBar.open(snackMessage, action, {
					duration: 5000,
				});
				//TODO dont add updated category
				const upsertedCategory = <Category>result;
				const existedCategory = this.categories.find(category => category.id === upsertedCategory.id);
				if (upsertedCategory.isActive && !existedCategory) {
					this.categories.push(upsertedCategory);
				} else {
					const filteredCategories = this.categories.filter(category => category.id !== upsertedCategory.id);
					this.categories = filteredCategories;
				}
			} else {
				this.status = 'error';
				snackMessage = this.status;
				action = `Try again`;
			}
		});
	}

}
