export interface FinanceData {
	comment: string;
	date: string;
	id?: string;
	sum: number;
	category: string;
	userId: string;
	isDeleted?: boolean;
}

export interface Category {
	user: string;
	description: string;
	id: string;
	name: string;
	categoryIndex: number;
	createdAt?: string;
	updatedAt?: string;
	isActive: boolean;
	isIncome: boolean;
	icon: string;
}

export interface TransactionsData {
	category: string;
	transactions: FinanceData[];
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
	theme: string;
	balanceEdge: number;
	temporaryToken?: string;
}

export interface DashboardPeriod {
	from: Date,
	to: Date
}

export interface DashboardConfig {
	dashboardType: string,
	dashboardPeriod: DashboardPeriod,
	dashboardCategories: string[],
	user: LoggedUser
}

export interface ChartData {
	dashboardType: string,
	dashboardPeriod: DashboardPeriod,
	dashboardCategories: string[],
	user: LoggedUser,
	transactionsForPeriod: TransactionsData[]
}