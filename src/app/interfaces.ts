export interface FinanceData {
    comment: string;
    date: string;
    id: string;
    sum: string;
    type: string;
  }

  export interface ExpencesData {
    category: string;
    expences: FinanceData[];
    total: number;
  }