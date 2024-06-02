import { Card, Row, Col } from 'antd';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import Chart from 'react-apexcharts';
import { RootState } from '../../redux/store';
import { Payment, DataValues } from '../../interfaces/DataValues';

const Dashboard: React.FC = () => {
  const debts = useSelector((state: RootState) => state.debts.items);

 const totalDebt = debts.reduce((sum, debt:DataValues) => sum + debt.amount, 0);
 const paidDebt = debts.reduce((sum, debt:DataValues) => {
   const paidAmount = debt.paymentPlan.reduce((acc:number, payment:Payment) => {
     if (payment.isPaid) {
       return acc + payment.paymentAmount;
     }
     return acc;
   }, 0);
   return sum + paidAmount;
 }, 0);

 const unpaidDebt = totalDebt - paidDebt;
 const nextMonth = dayjs().add(1, 'month').month();
 const upcomingPayments = debts.flatMap((debt:DataValues) =>
   debt.paymentPlan.filter(payment => 
     dayjs(payment.paymentDate).month() === nextMonth && 
     dayjs(payment.paymentDate).year() === dayjs().year() &&
     !payment.isPaid
   )
 ).map(payment => ({
   date: dayjs(payment.paymentDate).format('DD.MM.YYYY'),
   amount: payment.paymentAmount
 }));

 const chartOptions = {
   labels: ['Ödenen Borç', 'Kalan Borç'],
   colors: ['#00E396', '#FF4560'],
   legend: {
     position: 'bottom'
   },
   dataLabels: {
     formatter: function (val: number) {
       return val.toFixed(2) + "%";
     }
   }
 };

 const chartSeries = [paidDebt, unpaidDebt];

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Toplam Borç" bordered={false} style={{ marginBottom: 16 }}>
            {totalDebt.toFixed(2)} ₺
          </Card>
          <Card title="Ödenen Borç" bordered={false}>
            {paidDebt.toFixed(2)} ₺
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Yaklaşan Ödeme Tarihleri" bordered={false}>
            {upcomingPayments.length > 0 ? (
              upcomingPayments.map((payment, index) => (
                <div key={index}>
                  {payment.date}: {payment.amount.toFixed(2)} ₺
                </div>
              ))
            ) : (
              <div>Yaklaşan ödeme bulunmamaktadır.</div>
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Borç Durumu Grafiği" bordered={false}>
            <Chart options={chartOptions} series={chartSeries} type="pie" width="100%" />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
