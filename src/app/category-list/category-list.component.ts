import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';
import { Category } from '../interfaces';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-category-list',
	templateUrl: './category-list.component.html',
	styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
	@Input() appUser: LoggedUser;

	deleteCategoryModal: MatDialogRef<ModalComponent>;
	thisMonthExpensesTotal: number;
	categories: Category[];

	expenseMenuItems = [
		{ name: `Details`, action: this.openExpensesDetailComponent.bind(this) },
		{ name: `Edit`, action: this.editCategory.bind(this) },
		{ name: `Delete`, action: this.callDeleteConfirmationModal.bind(this) }
	];
	subMenuItems: string[] = [`name`, `date`, `sum`];

	constructor(
		private http: HttpClient,
		private router: Router,
		private dataService: DataService,
		private snackBar: MatSnackBar,
		private dialog: MatDialog
	) { }

	ngOnInit() {
		console.log('---> appUser CatList ', this.appUser);
		this.buildCategoriesList();
	}

	buildCategoriesList() {
		if (this.appUser.categories) {
			const userExpenses = this.appUser.categories.filter(category => !category.isIncome);
			const userCategories = [...userExpenses];
			const categoriesWithInitials = this.setCategoriesInitials(userCategories);
			this.categories = categoriesWithInitials;
		}
	}

	setCategoriesInitials(categories: any[]) {
		const categoriesWithInitials = categories.reduce((categoriesList, currentCategory) => {
			if (!currentCategory.initials) {
				currentCategory.initials = currentCategory.name.substring(0, 2);
			}
			if (!currentCategory.bgColor) {
				currentCategory.bgColor = `#8e8e8e`;
			}
			if (!currentCategory.color) {
				currentCategory.color = `white`;
			}
			categoriesList.push(currentCategory);
			return categoriesList;
		}, []);

		return categoriesWithInitials;

	}

	openAddCategoryModal() {
		this.router.navigate(['/category']);
	}

	sortCategoriesByField(fieldName: string) {
		if (fieldName === `name`) {
			this.sortCategoriesByName();
		}
		if (fieldName === `date`) {
			this.sortCategoriesByDate();
		}
		if (fieldName === `sum`) {
			this.sortCategoriesBySum();
		}
	}

	sortCategoriesByName() {
		const sortedCategories = this.categories.sort((a, b) => (a.name > b.name) ? 1 : -1)
		this.categories = [...sortedCategories];
		this.updateCategoriesIndexes();
	}

	sortCategoriesByDate() {
		const sortedCategories = this.categories.sort(function compare(a, b) {
			return (new Date(b.updatedAt) as any) - (new Date(a.updatedAt) as any);
		});
		this.categories = [...sortedCategories];
		this.updateCategoriesIndexes();
	}

	sortCategoriesBySum() {
		const expenseCategories = [...this.categories];
		const thisMonthExpenses = this.dataService.getThisMonthTransactions([...this.appUser.transactions]);
		const expensesByCategory = expenseCategories.reduce((expensesList, currentCategory) => {
			const thisCategoryExpenses = thisMonthExpenses.filter(expense => expense.category === currentCategory.id);
			const expensesSum = this.dataService.countCategoryTransactionsTotal(thisCategoryExpenses);
			const espensesByCategory = {
				categoryId: currentCategory.id,
				categoryExpenses: thisCategoryExpenses,
				categoryExpensesSum: expensesSum
			}
			expensesList.push(espensesByCategory);
			return expensesList;
		}, []);

		const expensesByCategorySorted = expensesByCategory.sort((a, b) => (a.categoryExpensesSum > b.categoryExpensesSum) ? -1 : 1);

		const sortedCategories = expenseCategories.reduce((categoriesList, currentCategory) => {
			const categoryIndex = expensesByCategorySorted.findIndex(exp => exp.categoryId === currentCategory.id);
			categoriesList.splice(categoryIndex, 0, currentCategory);
			return categoriesList;
		}, []);
		this.categories = sortedCategories;
		this.updateCategoriesIndexes();
	}

	updateCategoriesIndexes() {
		this.categories.forEach(function (category, index) {
			category.categoryIndex = index;
		});
		const categoriesToUpsert = [...this.categories];
		this.doUpsertCategoriesCall(categoriesToUpsert);
	}

	doUpsertCategoriesCall(categoriesToUpsert: Category[]) {
		const requestUrl = `${environment.apiBaseUrl}/category/upsert`;
		this.http.post(requestUrl, {
			categoriesToUpsert: categoriesToUpsert
		}, { observe: 'response' }
		).subscribe(
			response => {
				const snackMessage = 'Done';
				const action = `OK`;
				this.snackBar.open(snackMessage, action, {
					duration: 5000,
				});
				const upsertedCategories = <Category>response.body;
				this.dataService.updateToken(response.headers.get('Authorization'));
			},
			error => {
				console.log('---> UPSERT CAT ', error);
				const snackMessage = 'Oops!';
				const action = `Try again`;
				this.snackBar.open(snackMessage, action, {
					duration: 5000,
				});
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);

	}

	editCategory(categoryToEdit: Category) {
		if (categoryToEdit) {
			this.router.navigate([`/category/${categoryToEdit.id}`]);
		}
	}

	callDeleteConfirmationModal(categoryToDelete: Category) {
		this.openDeleteCategoryDialog(categoryToDelete);
	}

	deleteCategory(categoryToDelete: Category) {
		const categoriesToUpsert = [...this.categories].reduce((categoriesList, currentCategory) => {
			if (currentCategory.id === categoryToDelete.id) {
				currentCategory.isActive = false;
			}
			if (currentCategory.categoryIndex > categoryToDelete.categoryIndex) {
				currentCategory.categoryIndex = currentCategory.categoryIndex - 1;
			}
			categoriesList.push(currentCategory);
			return categoriesList;
		}, []);

		this.categories = categoriesToUpsert.filter(category => category.id != categoryToDelete.id);
		this.doUpsertCategoriesCall(categoriesToUpsert);
	}

	openDeleteCategoryDialog(categoryToDelete: Category) {
		this.deleteCategoryModal = this.dialog.open(ModalComponent, {
			hasBackdrop: false,
			data: {
				message: `Are you sure you want to delete ${categoryToDelete.name} category?
				Notice that all related expenses will be deleted too.`
			}
		});
		this.deleteCategoryModal
			.afterClosed()
			.subscribe(isActionConfirmed => {
				if (isActionConfirmed)
					this.deleteCategory(categoryToDelete);
			});
	}

	openExpensesDetailComponent(category: Category) {
		if (category) {
			this.router.navigate([`/detail/${category.id}`]);
		}
	}

}
