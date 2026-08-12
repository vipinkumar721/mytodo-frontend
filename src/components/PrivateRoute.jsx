import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  // Agar user state mein hai, toh page dikhao (children), warna Login par bhej do
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;