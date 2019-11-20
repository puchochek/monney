export interface FinanceData {
	comment: string;
	date: string;
	id: string;
	sum: number;
	category: string;
	userId: string;
	isDeleted: boolean;
}

export interface Category {
	user: string;
	description: string;
	id: string;
	name: string;
	categoryIndex: number;
	createdAt: string;
	updatedAt: string;
	isActive: boolean;
	isIncome: boolean;
}

export interface TransactionsData {
	category: string;
	transactions: FinanceData[];
	total: number;
}

export interface LoggedUser {
	avatar: string;
	id: string;
	password: string;
	name: string;
	email: string;
	isConfirmed: boolean;
	categories: Category[];
	transactions: FinanceData[];
}