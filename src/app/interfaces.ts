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
	transactions: Transaction[];
}

export interface LoginUser {
	email: string;
	password: string;
}

export interface StorageUser {
	avatar: string;
	//userName: string;
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
}