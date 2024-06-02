import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login'
import Debts from './pages/Debts/Debts';
import PaymentPlan from './pages/PaymentPlan/PaymentPlan';
import Register from './pages/Register/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';


const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  );
};

const AppRoutes: React.FC = () => {

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/debts"
        element={
          <ProtectedRoute>
            <Debts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-plan/:debtId"
        element={
          <ProtectedRoute>
            <PaymentPlan />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
