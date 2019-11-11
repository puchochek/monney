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

import { MatMenuModule, MatButtonModule } from '@angular/material';

@Component({
	selector: 'app-category-list',
	templateUrl: './category-list.component.html',
	styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
	@Input() appUser: LoggedUser;
	deleteCategoryModal: MatDialogRef<ModalComponent>;

	categories: Category[];
	expenseMenuItems = [{ name: `Details`, action: `` }, { name: `Edit`, action: this.editCategory.bind(this) }, { name: `Delete`, action: this.callDeleteConfirmationModal.bind(this) }];
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
		const thisMonthExpenses = this.dataService.getThisMonthTransactions([...this.appUser.expences]);
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
		// this.http.post(requestUrl, {
		// 	categoriesToUpsert: categoriesToUpsert
		// }, { observe: 'response' }
		// ).subscribe(
		// 	response => {
		// 		const upsertedCategories = <Category>response.body;
		// 		this.dataService.updateToken(response.headers.get('Authorization'));
		// 	},
		// 	error => {
		// 		console.log('---> UPSERT CAT ', error);
		// 	},
		// 	() => {
		// 		// 'onCompleted' callback.
		// 		// No errors, route to new page here
		// 	}
		// );
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
		console.log('---> categoryToDelete', categoryToDelete);
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

	// setInitialCategoriesOrder(currentUserCategories: Category[]): Category[] {
	// 	const sortedCategories = currentUserCategories.sort((a, b) => {
	// 		if (a.categoryIndex > b.categoryIndex)
	// 			return 1
	// 		else
	// 			return -1
	// 	})
	// 	return sortedCategories;
	// }

	// defineScreenHeight() {
	// 	let headerHeight = document.getElementById('header').offsetHeight;
	// 	let viewHeight = window.innerHeight;
	// 	document.getElementById('categories-list').style.height = viewHeight - headerHeight + 'px';
	// }

	// defineColumnsNumber(categories: Category[]) {
	// 	const categoriesNumber = categories.length;

	// 	switch (true) {
	// 		case (categoriesNumber <= 5):
	// 			this.columns = 1;
	// 			break;
	// 		case (categoriesNumber <= 10):
	// 			this.columns = 2;
	// 			break;
	// 		case (categoriesNumber <= 15):
	// 			this.columns = 3;
	// 			break;
	// 		case (categoriesNumber <= 20):
	// 			this.columns = 4;
	// 			break;
	// 		case (categoriesNumber <= 25):
	// 			this.columns = 5;
	// 			break;
	// 		case (categoriesNumber <= 30):
	// 			this.columns = 6;
	// 			break;
	// 		case (categoriesNumber <= 35):
	// 			this.columns = 7;
	// 		case (categoriesNumber <= 40):
	// 			this.columns = 8;
	// 			break;
	// 		default:
	// 			this.columns = 1;
	// 			break;
	// 	}
	// }

	// onDragOver(event) {
	// 	if (event.preventDefault) { event.preventDefault(); }
	// 	if (event.stopPropagation) { event.stopPropagation(); }
	// }

	// onDragStart(event) {
	// 	event
	// 		.dataTransfer
	// 		.setData('text', event.target.id);

	// 	event
	// 		.currentTarget
	// 		.style
	// 		.opacity = '0.5';
	// }

	// onDrop(event) {
	// 	if (event.preventDefault) { event.preventDefault(); }
	// 	if (event.stopPropagation) { event.stopPropagation(); }

	// 	const id = event
	// 		.dataTransfer
	// 		.getData('text');

	// 	const draggableElement = document.getElementById(id);
	// 	if (!draggableElement) {
	// 		event
	// 			.currentTarget
	// 			.style
	// 			.opacity = '1';
	// 		return;
	// 	}
	// 	const dropzone = event.target;
	// 	const categoriesBeforeDrag = [...this.categories];
	// 	const categoriesAfterDrag = [...this.categories];
	// 	const draggedItemIndex = this.categories.findIndex(category => category.name === id);
	// 	const targetItemIndex = this.categories.findIndex(category => category.name === dropzone.id);

	// 	categoriesAfterDrag[draggedItemIndex] = categoriesBeforeDrag[targetItemIndex];
	// 	categoriesAfterDrag[targetItemIndex] = categoriesBeforeDrag[draggedItemIndex];

	// 	this.categories = [...categoriesAfterDrag];
	// 	this.reorderCategories(draggedItemIndex, targetItemIndex);

	// 	event
	// 		.currentTarget
	// 		.style
	// 		.opacity = '1';

	// 	draggableElement
	// 		.style
	// 		.opacity = '1';

	// 	event
	// 		.dataTransfer
	// 		.clearData();
	// }

	// reorderCategories(draggedItemIndex: number, targetItemIndex: number) {
	// 	const url = `${environment.apiBaseUrl}/category/reorder`;
	// 	const userId = localStorage.getItem('userId');
	// 	this.http.post(url, {
	// 		userId: userId,
	// 		draggedItemIndex: draggedItemIndex,
	// 		targetItemIndex: targetItemIndex,
	// 	}, { observe: 'response' })
	// 		.subscribe(
	// 			response => {
	// 				const upsertedCategories = <Category[]>response.body;
	// 				console.log('---> upsertedCategories ', upsertedCategories);
	// 				this.dataService.updateToken(response.headers.get('Authorization'));
	// 			},
	// 			error => {
	// 				console.log('---> CATEGORIES LIST error ', error);
	// 			},
	// 			() => {
	// 				// 'onCompleted' callback.
	// 				// No errors, route to new page here
	// 			}
	// 		);

	// }

	// onSelect(category: Category): void {
	// 	this.categoryList = false;
	// 	this.selectedCategory = category;
	// }

}
