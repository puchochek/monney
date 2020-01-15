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
	addNewCategoryLbl: string = `Add new category`;
	sortCategoriesByLbl: string = `Sort categories by`;
	categoriesHeaderLbl: string = `categories`;
	subMenuItems: string[] = [`name`, `date`, `sum`];

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
				const currentCategories = [...this.currentUser.expensesCategories];
				const expenceCategoriesWithTotal = this.categoryService.setCategoriesTotal(currentCategories, this.currentUser);
				const expenceCategoriesWithLast = this.categoryService.setCategoriesLast(expenceCategoriesWithTotal, this.currentUser);
				const categoriesWithInitials = this.checkCategoriesIcon(expenceCategoriesWithLast);
				const sortedCategories = this.categoryService.sortCategories(categoriesWithInitials, this.currentUser.sortCategoriesBy);
				this.categories = [...sortedCategories];
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

	addCategory() {
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

	editCategory(event) {
		const categoryName = event.srcElement.id;
		const currentCategory = this.categories.find(category => category.name === categoryName);
		if (currentCategory) {
			this.router.navigate([`/category/edit/${currentCategory.id}`]);
		} else {
			this.router.navigate([`/home`]);
		}
	}

	sortCategoriesByField(fieldName: string) {
		const userToUpdate = {...this.currentUser};
		userToUpdate.sortCategoriesBy = fieldName;
		this.userService.updateUser(userToUpdate);
	}
}
