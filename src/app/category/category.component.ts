import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SelectIconComponent } from '../select-icon/select-icon.component';
import { CategoryService } from '../category.service';
import { Category } from '../interfaces';
import { Subscription } from 'rxjs';


@Component({
	selector: 'app-category',
	templateUrl: './category.component.html',
	styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
	@Input() name: string;
	@Input() description: string;

	private ADD_CATEGORY_ROUTE = `/category/add`;
	private DEFAULT_CATEGORY_ICON = `add`;
	categoryNameLbl: string = `name`;
	categoryDescriptionLbl: string = `description`;
	categoryIconLbl: string = `icon`;
	selectCategoryLbl: string = `select icon`;
	saveCategoryLbl: string = `save`;

	isSpinner: boolean;
	isCategoryEdit: boolean;
	categoryFormLbl: string;
	icon: string;

	selectIconDialogRef: MatDialogRef<SelectIconComponent>;
	private failedCategorySubscription: Subscription;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private dialog: MatDialog,
		private categoryService: CategoryService
	) { }

	ngOnInit() {
		this.failedCategorySubscription = this.categoryService._failedDategory.subscribe(response => {
			console.log('---> HOME _category ', response);
			if (response) {
				//TODO handle category error
			}
		});
		this.isCategoryEdit = this.router.url === this.ADD_CATEGORY_ROUTE ? false : true;
		this.categoryFormLbl = this.isCategoryEdit ? `edit category` : `add new category`;
		this.icon = this.DEFAULT_CATEGORY_ICON; //TODO FOR EDIT ADD USER ICON

	}

	ngOnDestroy() {
		if (this.failedCategorySubscription) {
			this.failedCategorySubscription.unsubscribe();
		}
	}

	openAddIconDialog() {
		this.selectIconDialogRef = this.dialog.open(SelectIconComponent);

		this.selectIconDialogRef
			.afterClosed()
			.subscribe(selectedIcon => this.icon = selectedIcon);
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
		if (!this.isCategoryEdit) {
			this.categoryService.createCategory(categoryToSave);
		}

	}
}
