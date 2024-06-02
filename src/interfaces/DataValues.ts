export interface DataValues {
    name: string;
    email: string;
    password: string;
    remember: boolean;
    debtName: string;
    lenderName: string;
    debtAmount: number;
    interestRate: number;
    amount: number;
    paymentStart: number;
    installment: number;
    description: string;
    paymentPlan: Payment[];
    debtId: string;
    isPaid: boolean;
    paymentPlanId: string;
}

export interface Payment {
    paymentPlanId: string;
    paymentDate: number;
    paymentAmount: number;
}

