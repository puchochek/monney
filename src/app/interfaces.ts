export interface ApplicationUser {
	id?: string;
	password?: string;
	name: string;
	email: string;
	isConfirmed: boolean;
	provider: string;
	avatar?: string;
	categories: Category[];
	sortCategoriesBy: string;
	balanceEdge: number;
	incomeCategory?: Category;
	expensesCategories?: Category[];
	transactions: Transaction[];
}

export interface LoginUser {
	email: string;
	password: string;
}

export interface StorageUser {
	avatar: string;
	initials: string;
}

export interface UserBalance {
	incomes: number;
	expenses: number;
	balance: number;
}

export interface Transaction {
	id?: string;
	user?: string;
	date: Date;
	comment?: string;
	category: string;
	sum: number;
	isDeleted: boolean;
}

export interface Category {
	id?: string;
	name: string;
	description?: string;
	user?: string;
	icon?: string;
	isDeleted: boolean;
	isIncome: boolean;
	initials?: string;
	transactions: Transaction[];
	total?: number;
	lastTransaction?: number;
	updatedAt?: Date;
	createdAt?: Date;
}

export interface DatePickerSetup {
	placeholder: string;
	isFromDate: boolean;
	isToDate: boolean;
	dateValue?: Date;
}

export class ChartItem {
	icon: string;
	class: string;
	tooltip: string;
}

export class CategoryChartItem {
	label: string;
	class: string;
}

export class ChartSetup {
	user: ApplicationUser;
	chartType: string;
	chartFromDate: Date;
	chartToDate: Date;
	categories: CategoryChartItem[];
}

export class ChartDataObject {
	category: string;
	transactions: Transaction[];
}