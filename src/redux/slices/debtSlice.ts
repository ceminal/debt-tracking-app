import { createSlice, nanoid } from '@reduxjs/toolkit';
import { DataValues } from '../../interfaces/DataValues';

const calculateTotalAmount = (amount:number, rate:number, periods:number) => {
    return amount * Math.pow(1 + (rate / 100), periods);
};

const generatePaymentPlan = (amount:number, installment:number, startDate:number) => {
    const paymentPlan = [];
    const paymentAmount = amount / installment;
    const currentDate = new Date(startDate);

    for (let i = 0; i < installment; i++) {
        currentDate.setMonth(currentDate.getMonth() + 1);
        paymentPlan.push({
            paymentDate: currentDate.toISOString(),
            paymentAmount: parseFloat(paymentAmount.toFixed(2)),
            isPaid: false,
            paymentPlanId: nanoid()
        });
    }
    return paymentPlan;
};

const initialState = {
    items: [],
    status: 'idle', 
    error: null
};

const debtsSlice = createSlice({
    name: 'debts',
    initialState,
    reducers: {
        addDebt: {
            reducer(state, action) {
                state.items.push(action.payload);
            },
            prepare(debt:DataValues) {
                const { debtAmount, interestRate, installment, paymentStart } = debt;
                const totalAmount = calculateTotalAmount(debtAmount, interestRate, installment);
                const paymentPlan = generatePaymentPlan(totalAmount, installment, paymentStart);

                return { 
                    payload: { 
                        ...debt, 
                        amount: totalAmount, 
                        paymentPlan, 
                        debtId: nanoid() 
                    } 
                };
            }
        },
        updateDebt(state, action) {
            const index = state.items.findIndex((debt:DataValues) => debt.debtId === action.payload.debtId);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        updatePaymentStatus(state, action) {
            const { debtId, paymentPlanId, isPaid } = action.payload;
            const debtIndex = state.items.findIndex(debt => debt.debtId === debtId);
            if (debtIndex !== -1) {
                const paymentIndex = state.items[debtIndex].paymentPlan.findIndex(payment => payment.paymentPlanId === paymentPlanId);
                if (paymentIndex !== -1) {
                    state.items[debtIndex].paymentPlan[paymentIndex].isPaid = isPaid;
                }
            }
        }
    }
});

export const { addDebt, updateDebt, removeDebt, updatePaymentStatus } = debtsSlice.actions;
export default debtsSlice.reducer;
