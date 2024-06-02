import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { List, Button, message } from 'antd';
import { updatePaymentStatus } from '../../redux/slices/debtSlice';
import { DataValues, Payment } from '../../interfaces/DataValues';

const PaymentPlan = () => {
    const { debtId } = useParams();
    const dispatch = useDispatch();
    const debt = useSelector(state =>
        state.debts.items.find((debt:DataValues) => debt.debtId === debtId)
    );

    useEffect(() => {
    }, [debt]);

    const handleMarkAsPaid = (paymentPlanId:Payment) => {
        dispatch(updatePaymentStatus({ debtId, paymentPlanId, isPaid: true }));
        message.success('Payment marked as paid');
    };

    return (
        <div>
            <h2>{debt?.debtName} Ödeme Planı</h2>
            <List
                dataSource={debt?.paymentPlan}
                renderItem={(item, index) => (
                    <List.Item
                        actions={[
                            <Button onClick={() => handleMarkAsPaid(item.paymentPlanId)} disabled={item.isPaid}>
                                Ödendi
                            </Button>
                        ]}
                    >
                        <List.Item.Meta
                            title={`${index + 1}.Taksit: ${new Date(item.paymentDate).toLocaleDateString()}`}
                            description={`Tutar: ${item.paymentAmount.toFixed(2)} ₺ - Durum: ${item.isPaid ? 'Ödendi' : 'Bekleniyor'}`}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
};

export default PaymentPlan;
