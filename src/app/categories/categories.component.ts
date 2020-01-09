import { Component, OnInit, Input } from '@angular/core';
import { ApplicationUser, Category } from '../interfaces';
import { CategoryService } from '../category.service';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-categories',
	templateUrl: './categories.component.html',
	styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
	categories: Category[];
	noCategoriesMessage: string;
	lastExpenceValue: number;
	expenceTotalValue: number;
	currentUser: ApplicationUser;

	addCategoryBtn: string = `add category`;
	lastExpenceLbl: string = `last:`;
	expenceTotalLbl: string = `total: `;
	categoriesHeaderLbl: string = `categories`;
	categoryMenuItems = [
		{ name: `Add category`, action: this.addCategory.bind(this) },
		// { name: `Log out`, action: this.logOut.bind(this) }
	];

	private userSubscription: Subscription;

	constructor(
		private categoryService: CategoryService,
		private router: Router,
		private userService: UserService,
	) { }

	ngOnInit() {
		this.userSubscription = this.userService._user.subscribe(response => {
			if (response) {
				this.currentUser = <ApplicationUser>response;
				console.log('---> CategoriesComponent ', this.currentUser);
				const currentCategories = [...this.currentUser.categories];
				const expenceCategories = this.categoryService.getExpencesCategories(currentCategories);
				const expenceCategoriesWithTotal = this.categoryService.setCategoriesTotal(expenceCategories, this.currentUser);
				const expenceCategoriesWithLast = this.categoryService.setCategoriesLast(expenceCategoriesWithTotal, this.currentUser);
				const categoriesWithInitials = this.checkCategoriesIcon(expenceCategoriesWithLast);
				this.categories = [...categoriesWithInitials];

			}
		});

		this.noCategoriesMessage = `Hello, ${this.currentUser.name}. You don't have an expences categories yet. It would be great to add some to keep your expences in order.`;
	}

	ngOnDestroy() {
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
	}

	checkCategoriesIcon(categories: Category[]): Category[] {
		const categoriesWithInitials = categories.reduce((categories, category) => {
			if (category.icon) {
				categories.push(category);
			} else {
				const initials = category.name.substring(0, 2);
				category.initials = initials;
				categories.push(category);
			}
			return categories;
		}, [])
		return categoriesWithInitials;
	}

	addCategory(event) {
		this.router.navigate(['/category/add']);
	}

	viewCategoryTransactions(event) {
		const categoryName = event.srcElement.id;
		this.router.navigate([`/${categoryName}/transactions`]);
	}

	addExpence(event) {
		const categoryName = event.srcElement.id;
		this.router.navigate([`/${categoryName}/add`]);
	}

}
