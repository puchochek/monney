import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TransactionService } from '../transaction.service';
import { UserService } from '../user.service';
import { CategoryService } from '../category.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Transaction, ApplicationUser, Category, DatePickerSetup } from '../interfaces';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
	selector: 'app-transactions-by-category',
	templateUrl: './transactions-by-category.component.html',
	styleUrls: ['./transactions-by-category.component.scss']
})
export class TransactionsByCategoryComponent implements OnInit {

	transactions: Transaction[];
	currentUser: ApplicationUser;
	categoryName: string;
	categoryDescription: string;
	currentCategory: Category;
	navigateUrl: string;

	private userSubscription: Subscription;
	confirmationDialogRef: MatDialogRef<ConfirmationModalComponent>;

	fromDate: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
	toDate: Date = new Date();
	transactionsHeaders: string[] = [`date`, `comment`, `sum`, `actions`];
	fromDatePickerSetup: DatePickerSetup = {
		placeholder: `from`,
		isFromDate: true,
		isToDate: false
	};

	toDatePickerSetup: DatePickerSetup = {
		placeholder: `to`,
		isFromDate: false,
		isToDate: true
	};
	reportsLink = `reports page.`;
	tableInfoMessage = `*Only this month transactions are available here. If You wish to look through the earlier transactions - check the `;

	constructor(
		private transactionService: TransactionService,
		private categoryService: CategoryService,
		private userService: UserService,
		private route: ActivatedRoute,
		private router: Router,
		private dialog: MatDialog,
	) {
		this.userService.getUserByToken();
	}

	ngOnInit() {
		this.categoryName = this.route.snapshot.paramMap.get('category');
		this.navigateUrl = `${this.categoryName}/transactions`;

		this.userSubscription = this.userService._user.subscribe(response => {
			if (response) {
				console.log('---> transactions USER ', response);
				this.currentUser = <ApplicationUser>response;
				this.currentCategory = this.categoryService.getCategoryByName(this.currentUser, this.categoryName);
				if (this.currentCategory) {
					this.categoryDescription = this.currentCategory.description || '';
				}
				const currentCategoryTransactions = this.transactionService.getTransactionsByCategoryId(this.currentUser, this.currentCategory.id);
				const thisMonthTransactions = this.transactionService.getThisMonthTransactions(currentCategoryTransactions);
				this.transactions = [...thisMonthTransactions];
			}
		});
	}

	ngOnDestroy() {
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
	}

	handleFromDateChange(fromDateChanged: Date) {
		this.fromDate = fromDateChanged;
		this.getTransactionsByDates();

	}

	handleToDateChange(toDateChanged: Date) {
		this.toDate = toDateChanged;
		this.getTransactionsByDates();
	}

	getTransactionsByDates() {
		const currentTransactions = this.transactionService.getTransactionsByCategoryId(this.currentUser, this.currentCategory.id);
		const transactionsByDates = this.transactionService.getTransactionsByDates(this.fromDate, this.toDate, currentTransactions);
		this.transactions = [...transactionsByDates];
	}

	editTransaction(event) {
		const transactionToEditId = event.srcElement.id;
		this.userService.appUser = this.currentUser;
		this.router.navigate([`/${this.categoryName}/edit/${transactionToEditId}`]);
	}

	openDeleteConformationModal(event) {
		const transactionToDeleteId = event.srcElement.id;
		const transactionToDelete = this.transactionService.getTransactionById(this.transactions, transactionToDeleteId);
		this.openAddFileDialog(transactionToDelete);
	}

	deleteTransaction(transactionToDelete: Transaction) {
		transactionToDelete.isDeleted = true;
		this.transactionService.deleteTransaction(this.currentUser, transactionToDelete);
	}

	openAddFileDialog(transactionToDelete: Transaction) {
		this.confirmationDialogRef = this.dialog.open(ConfirmationModalComponent, {
			data: {
				message: `Are you sure you want to delete this transaction: `,
				itemInfo: `${transactionToDelete.comment}, of sum ${transactionToDelete.sum} ?`
			}
		});
		this.confirmationDialogRef
			.afterClosed()
			.subscribe(isActionConfirmed => {
				if (isActionConfirmed) {
					this.deleteTransaction(transactionToDelete);
				}
			});
	}
}
