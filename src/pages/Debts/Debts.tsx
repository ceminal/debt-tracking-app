import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Form, InputNumber, Input, DatePicker, message } from 'antd';
import { addDebt, updateDebt } from '../../redux/slices/debtSlice';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { nanoid } from '@reduxjs/toolkit';
import { RootState } from '../../redux/store';
import { DataValues } from '../../interfaces/DataValues';

const Debts = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const debts = useSelector((state: RootState) => state.debts.items);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDebt, setEditingDebt] = useState(null);
    const [form] = Form.useForm();

    const handleAddDebt = () => {
        setEditingDebt(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEditDebt = (debt: DataValues) => {
        setEditingDebt(debt);
        form.setFieldsValue({ ...debt, paymentStart: dayjs(debt.paymentStart)});
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const { debtAmount, interestRate, installment, paymentStart, debtName, lenderName, description } = values;

            const totalAmount = debtAmount * Math.pow(1 + (interestRate / 100), installment);
            const paymentPlan = Array.from({ length: installment }, (_, i) => ({
                paymentDate: dayjs(paymentStart).add(i, 'month').toISOString(),
                paymentAmount: parseFloat((totalAmount / installment).toFixed(2)),
                isPaid: false,
                paymentPlanId: editingDebt ? editingDebt.paymentPlan[i]?.paymentPlanId : nanoid()
            }));

            const newDebt = {
                debtName,
                lenderName,
                debtAmount,
                interestRate,
                amount: totalAmount,
                paymentStart: dayjs(paymentStart).toISOString(),
                installment,
                description,
                paymentPlan,
                debtId: editingDebt ? editingDebt.debtId : nanoid()
            };

            if (editingDebt) {
                dispatch(updateDebt(newDebt));
            } else {
                dispatch(addDebt(newDebt));
            }

            setIsModalOpen(false);
            form.resetFields();
            message.success('Debt successfully processed!');
        } catch (error) {
            message.error('Error processing the form.');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const navigatePaymentPlan = (debtId:string) => {
        navigate(`/payment-plan/${debtId}`);
    };

    const columns = [
        { title: 'Borç Adı', dataIndex: 'debtName', key: 'debtName' },
        { title: 'Borcu veren kişi/kurum', dataIndex: 'lenderName', key: 'lenderName' },
        { title: 'Borç Tutarı', dataIndex: 'debtAmount', key: 'debtAmount' },
        { title: 'Faiz Oranı', dataIndex: 'interestRate', key: 'interestRate' },
        { title: 'Taksit Sayısı', dataIndex: 'installment', key: 'installment' },
        { title: 'Toplam Ödenecek Tutar', dataIndex: 'amount', key: 'amount', render: (amount:number) => amount.toFixed(2) },
        { title: 'Ödeme Başlangıcı', dataIndex: 'paymentStart', key: 'paymentStart', render: (text:string) => dayjs(text).format('DD.MM.YYYY') },
        {
            title: 'Aksiyonlar', key: 'action', render: (_: any, record: DataValues) => (
                <span>
                    <Button type="link" onClick={() => handleEditDebt(record)}>Düzenle</Button>
                    <Button type="link" onClick={() => navigatePaymentPlan(record.debtId)}>Ödeme Planını Gör</Button>
                </span>
            )
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={handleAddDebt} style={{ marginBottom: 16 }}>
                Yeni Borç Ekle
            </Button>
            <Table columns={columns} dataSource={debts} rowKey="debtId" />
            <Modal
                title={editingDebt ? "Borç Güncelle" : "Yeni Borç Oluştur"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="debtName" label="Borç Adı" rules={[{ required: true, message: 'Lütfen borç adını girin!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="lenderName" label="Borcu veren kişi/kurum" rules={[{ required: true, message: 'Lütfen borcu veren kişi/kurum adını girin!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="debtAmount" label="Borç Miktarı" rules={[{ required: true, message: 'Lütfen borç miktarını girin!' }]}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="interestRate" label="Faiz Oranı (%)" rules={[{ required: true, message: 'Lütfen faiz oranını girin!' }]}>
                        <InputNumber min={0} max={100} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="installment" label="Taksit Sayısı" rules={[{ required: true, message: 'Lütfen taksit sayısını girin!' }]}>
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="paymentStart" label="Ödeme Başlangıç Tarihi" rules={[{ required: true, message: 'Lütfen ödeme başlangıç tarihini seçin!' }]}>
                        <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
                    </Form.Item>
                    <Form.Item name="description" label="Açıklama">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Debts;
