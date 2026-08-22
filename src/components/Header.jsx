import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, reset } from '../redux/authSlice';
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode"; 

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  
  const { user } = useSelector((state) => state.auth);

  
  let decodedName = "";
  if (user && user.token) {
    try {
      const decodedToken = jwtDecode(user.token);
      decodedName = decodedToken.name; 
    } catch (error) {
      console.error("Token decode nahi ho paya", error);
    }
  }

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    toast.success('Logged out successfully');
  };

  return (
<header className="bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
    
    <h1 className="text-2xl font-extrabold text-emerald-900 tracking-tight">
      MyTodo
    </h1>
    
    
    {user && (
      <div className="flex items-center gap-5 sm:gap-6">
        <span className="text-sm font-medium text-gray-500 hidden sm:inline-block">
          Welcome, <span className="text-emerald-800 font-semibold">{decodedName}</span>
        </span>
        
        <button
          onClick={onLogout}
          className="bg-white border border-gray-200 text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-100"
        >
          Logout
        </button>
      </div>
    )}
    
  </div>
</header>
  );
};

export default Header;