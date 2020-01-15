import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from '../category.service';
import { UserService } from '../user.service';
import { Category, ApplicationUser } from '../interfaces';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SelectIconComponent } from '../select-icon/select-icon.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';


@Component({
	selector: 'app-category',
	templateUrl: './category.component.html',
	styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
	@Input() name: string;
	@Input() description: string;
	@ViewChild("nameInput", { static: false }) _el: ElementRef;

	private ADD_CATEGORY_ROUTE = `/category/add`;
	private DEFAULT_CATEGORY_ICON = `add`;
	categoryNameLbl: string = `name`;
	categoryDescriptionLbl: string = `description`;
	categoryIconLbl: string = `icon`;
	selectCategoryLbl: string = `select icon`;
	saveCategoryLbl: string = `save`;
	deleteCategoryLbl: string = `delete`;

	isSpinner: boolean;
	isCategoryEdit: boolean;
	categoryFormLbl: string;
	icon: string;
	categoryId: string;
	currentUser: ApplicationUser;
	categoryToEdit: Category;

	selectIconDialogRef: MatDialogRef<SelectIconComponent>;
	confirmationDialogRef: MatDialogRef<ConfirmationModalComponent>;

	private failedCategorySubscription: Subscription;
	private userSubscription: Subscription;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private dialog: MatDialog,
		private categoryService: CategoryService,
		private userService: UserService,
	) { }

	ngAfterViewInit() {
		this._el.nativeElement.focus();
	}

	ngOnInit() {
		this.failedCategorySubscription = this.categoryService._failedDategory.subscribe(response => {
			if (response) {
				console.log('---> HOME failed category ', response);
				//TODO handle category error
			}
		});
		this.isCategoryEdit = this.router.url === this.ADD_CATEGORY_ROUTE ? false : true;
		this.categoryFormLbl = this.isCategoryEdit ? `edit category` : `add new category`;
		if (this.route.snapshot.paramMap.get('id')) {
			this.categoryId = this.route.snapshot.paramMap.get('id');
		}

		if (this.categoryId) {
			this.userSubscription = this.userService._user.subscribe(response => {
				if (response) {
					console.log('---> category USER ', response);
					this.currentUser = <ApplicationUser>response;
					this.categoryToEdit = this.currentUser.categories.filter(category => category.id === this.categoryId)[0];
					this.name = this.categoryToEdit.name;
					this.description = this.categoryToEdit.description;
					if (this.categoryToEdit.icon) {
						this.icon = this.categoryToEdit.icon;
					} else {
						this.icon = this.DEFAULT_CATEGORY_ICON;
					}
				} else if (localStorage.getItem(`token`)) {
					this.userService.getUserByToken();
				} else {
					this.router.navigate([`/home`]);
				}
			});
		} else {
			this.icon = this.DEFAULT_CATEGORY_ICON;
		}
	}

	ngOnDestroy() {
		if (this.failedCategorySubscription) {
			this.failedCategorySubscription.unsubscribe();
		}
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
	}

	openAddIconDialog() {
		this.selectIconDialogRef = this.dialog.open(SelectIconComponent);

		this.selectIconDialogRef
			.afterClosed()
			.subscribe(selectedIcon => this.icon = selectedIcon);
	}

	openConfirmationDialog() {
		this.confirmationDialogRef = this.dialog.open(ConfirmationModalComponent, {
			data: {
				message: `Are you sure you want to delete this category: ${this.categoryToEdit.name}? Notice that all the related transactions will be deleted as well.`
			}
		});
		this.confirmationDialogRef
			.afterClosed()
			.subscribe(isActionConfirmed => {
				if (isActionConfirmed) {
					this.deleteCategory();
				}
			});
	}

	handleSaveBtnClick() {
		if (this.isCategoryEdit) {
			this.editCategory();
		} else {
			this.saveCategory();
		}
	}

	saveCategory() {
		const categoryToSave: Category = {
			name: this.name,
			description: this.description,
			icon: this.icon === this.DEFAULT_CATEGORY_ICON ? '' : this.icon,
			isDeleted: false,
			isIncome: false,
			transactions: []
		}
		this.isSpinner = true;
		this.categoryService.createCategory(categoryToSave);
	}

	editCategory() {
		const categoryToUpdate = { ...this.categoryToEdit };
		categoryToUpdate.name = this.name;
		categoryToUpdate.description = this.description;
		categoryToUpdate.icon = this.icon === this.DEFAULT_CATEGORY_ICON ? '' : this.icon;

		this.isSpinner = true;
		this.categoryService.updateCategory(categoryToUpdate);
	}

	deleteCategory() {
		const categoryToDelete = { ...this.categoryToEdit };
		categoryToDelete.isDeleted = true;

		this.isSpinner = true;
		this.categoryService.updateCategory(categoryToDelete);
	}
}
