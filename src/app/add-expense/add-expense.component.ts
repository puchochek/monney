import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl } from '@angular/forms';
import { FinanceData, LoggedUser, Category } from '../interfaces';
import { Subscription } from 'rxjs';
import { TransactionService } from '../transaction.service';
import { UserService } from '../user.service';
import { CategoryService } from '../category.service';

@Component({
	selector: 'app-add-expense',
	templateUrl: './add-expense.component.html',
	styleUrls: ['./add-expense.component.scss'],
	providers: []
})
export class AddExpenseComponent implements OnInit {
	@Input() sum: number;
	@Input() comment: string;

	currentUser: LoggedUser;
	category: string;
	status: string;
	isInvalidInput: boolean;
	invalidInputMessage: string;
	dateShiftRight: number;
	message: string;
	savedExpense: FinanceData;
	title: string;
	addNewAction: string;
	editAction: string;
	transactionName: string;
	invaildSumMessage: string;
	isEdit: boolean;
	transactionSum: number;
	transactionToEdit: FinanceData;
	date = new FormControl(new Date());
	serializedDate = new FormControl((new Date()).toISOString());
	maxDate = new Date();
	balance: number;
	selectedCategory: string;
	// minDate = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), 1);
	private subscription: Subscription;
	private userSubscription: Subscription;
	navigateUrl = `/home`;

	constructor(
		private dataService: DataService,
		private route: ActivatedRoute,
		private router: Router,
		private transactionService: TransactionService,
		private userService: UserService,
		private categoryService: CategoryService,

	) { }

	ngOnInit() {
		this.categoryService.checkIncomeCategory();

		this.selectedCategory = this.route.snapshot.paramMap.get('category');
		this.transactionName = this.selectedCategory === `Income` ?
			`Income`
			: `expense`;

		this.userSubscription = this.userService._user.subscribe((response) => {
			console.log('---> ADD EXPENSE _user ', response);
			if (response) {
				this.currentUser = <LoggedUser>response;
				if (this.transactionName !== `Income`) {
					this.setBalanceInfo();
				}
			} else {
				console.log('--->ADD EXPENSE error ');
				this.router.navigate([`${this.navigateUrl}`]);
			}
		});

		this.isEdit = this.route.snapshot.paramMap.get('action') === `edit` ? true : false;

		if (this.isEdit) {
			this.subscription = this.transactionService._transaction.subscribe((response) => {
				console.log('--->  ADD EXPENSE _transaction ', response);
				if (response) {
					this.transactionToEdit = <FinanceData>response;
				} else {
					this.router.navigate([`${this.navigateUrl}`]);
				}
			});
		}

		this.category = this.selectedCategory;
		this.addNewAction = `Add new`;
		this.editAction = `Edit`;
		this.title = this.isEdit ?
			`${this.editAction} ${this.transactionName}`
			: `${this.addNewAction} ${this.transactionName}`;
		if (this.isEdit) {
			this.sum = Number(this.transactionToEdit.sum);
			this.comment = this.transactionToEdit.comment;
			this.date = new FormControl(this.transactionToEdit.date);
		}
	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
	}

	onSubmit() {
		const newExpence = {
			sum: this.sum,
			comment: this.comment,
			type: this.category,
			date: this.date.value,
		};
		if (this.validateSum(newExpence.sum)) {
			if (this.isEdit) {
				this.editTransaction(newExpence);
			} else {
				this.saveNewExpence(newExpence);
			}
		}
	}

	closeModal() {
		if (this.isEdit && this.transactionName !== `Income`) {
			this.router.navigate([`/detail/${this.selectedCategory}`]);
		} else {
			this.router.navigate([`${this.navigateUrl}`]);
		}
	}

	hideErrorMessage() {
		this.isInvalidInput = false;
	}

	validateSum(sum: number): boolean {
		if (isNaN(sum) || (!sum) || (Number(sum) < 0)) {
			this.isInvalidInput = true;
			this.invaildSumMessage = `The Sum field may keep a positive number value only`;
			return false;
		} else {
			if (this.transactionName === `Income`) {
				this.isInvalidInput = false;
				return true;
			} else {
				if (sum < this.balance) {
					this.isInvalidInput = false;
					return true;
				}
			}
		}
		this.isInvalidInput = true;
		this.invaildSumMessage = `You may not spend more money than you have. Check your Incomes to continue.`;

		return false;
	}

	saveNewExpence(newExpence: any) {
		const userId = this.currentUser.id;
		const categoryName = this.route.snapshot.paramMap.get('category');
		const transactionToSave: FinanceData = {
			comment: newExpence.comment,
			sum: newExpence.sum,
			category: categoryName,
			userId: userId,
			date: newExpence.date
		};

		this.transactionService.createTransaction(transactionToSave, this.navigateUrl);
	}

	editTransaction(transaction: any) {
		const transactionToSave: FinanceData = {
			comment: transaction.comment,
			id: this.transactionToEdit.id,
			sum: transaction.sum,
			category: this.transactionToEdit.category,
			userId: this.transactionToEdit.userId,
			date: transaction.date,
			isDeleted: false
		};
		let navigateUrl: string;
		if (this.transactionName !== `Income` && !this.transactionToEdit) {
			navigateUrl = `/home`;
		} else {
			navigateUrl = `/detail/${this.selectedCategory}`;
		}

		this.transactionService.updateTransaction(transactionToSave, navigateUrl);
	}

	setBalanceInfo() {
		const IncomeId = this.dataService.findIncomeId(this.currentUser);
		const expensesTotal = this.dataService.setThisMonthExpensesTotal(this.currentUser, IncomeId);
		const IncomesTotal = this.dataService.setThisMonthIncomesTotal(this.currentUser, IncomeId);
		const balanceTotal = this.dataService.setThisMonthBalanceTotal(IncomesTotal, expensesTotal);

		this.balance = balanceTotal;
	}
}
