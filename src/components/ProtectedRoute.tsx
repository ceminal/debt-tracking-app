import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AppLayout from './Layout';

interface ProtectedRouteProps {
    children: JSX.Element;
  }
  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <AppLayout>{children}</AppLayout>;
};

export default ProtectedRoute