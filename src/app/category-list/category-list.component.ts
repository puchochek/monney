import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';
import { Category } from '../interfaces';
import { FinanceData } from '../interfaces';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { CategoryService } from '../category.service';
import { BalanceService } from '../balance.service';


@Component({
	selector: 'app-category-list',
	templateUrl: './category-list.component.html',
	styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
	@Input() appUser: LoggedUser;
	private subscription: Subscription;

	currentUser: LoggedUser;
	deleteCategoryModal: MatDialogRef<ModalComponent>;
	thisMonthExpensesTotal: number;
	categories: Category[];
	lastModifiedLbl: string = `Last: `;
	categoryTotalLbl: string = `Total: `;
	navigateLink: string = `/home`;
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
		private dialog: MatDialog,
		private userService: UserService,
		private categoryService: CategoryService,
		private balanceService: BalanceService,

	) { }

	ngOnInit() {
		this.subscription = this.userService._user.subscribe((response) => {
			console.log('---> CATEGORY LIST _user ', response);
			if (response) {
				this.currentUser = <LoggedUser>response;
			} else {
				console.log('---> CATEGORY LIST error ');
				this.router.navigate([`/home`]);
			}
		});
		this.buildCategoriesList();
	}
	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	buildCategoriesList() {
		if (this.currentUser.categories) {
			const userExpenses = this.currentUser.categories.filter(category => !category.isIncome);
			const userCategories = [...userExpenses];
			const categoriesWithInitials = this.setCategoriesInitials(userCategories);
			const categoriesWithLastTransactions = categoriesWithInitials.reduce((categoriesList, category) => {
				const thisCategoryTransactions = this.dataService.sortTransactionsByCategoryId(category.id, this.currentUser.transactions);
				if (thisCategoryTransactions.length !== 0) {
					const thisMonthTransactions = this.dataService.getThisMonthTransactions(thisCategoryTransactions);
					const transactionsSum = this.balanceService.countCategoryTransactionsSum(thisMonthTransactions, `sum`);
					const lastTransaction = this.getLastTransaction(thisCategoryTransactions);
					const lastTransactionDate = new Date(lastTransaction.date).toLocaleString('en', { month: 'short', day: 'numeric' });
					category.lastTransaction = `${lastTransaction.sum}, ${lastTransactionDate}`;
					category.total = transactionsSum;
				} else {
					category.lastTransaction = `-`;
					category.total = 0;
				}
				categoriesList.push(category);
				return categoriesList;
			}, []);
			this.categories = [...categoriesWithLastTransactions].sort(function (a, b) {
				if (a.categoryIndex > b.categoryIndex) { return 1; }
				if (a.categoryIndex < b.categoryIndex) { return -1; }
				return 0;
			});
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
		this.router.navigate(['/new/category']);
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

	getLastTransaction(transactionsToSort: FinanceData[]): FinanceData {
		const sortedTransactions = transactionsToSort.sort(function compare(a, b) {
			return (new Date(b.date) as any) - (new Date(a.date) as any);
		});

		return sortedTransactions[0];
	}

	sortCategoriesBySum() {
		const expenseCategories = [...this.categories];
		const thisMonthExpenses = this.dataService.getThisMonthTransactions([...this.currentUser.transactions]);
		const expensesByCategory = expenseCategories.reduce((expensesList, currentCategory) => {
			const thisCategoryExpenses = thisMonthExpenses.filter(expense => expense.category === currentCategory.id);
			const expensesSum = this.balanceService.countCategoryTransactionsSum(thisCategoryExpenses, `sum`);
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

		this.categoryService.updateCategory(categoriesToUpsert, this.navigateLink);
	}

	editCategory(categoryToEdit: Category) {
		if (categoryToEdit) {
			this.router.navigate([`/edit/${categoryToEdit.name}`]);
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
		this.categoryService.deleteCategory(categoryToDelete, this.navigateLink);
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
			this.router.navigate([`/detail/${category.name}`]);
		}
	}
}
