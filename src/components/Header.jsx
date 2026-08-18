import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, reset } from '../redux/authSlice';
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode"; // 👈 NAYA IMPORT

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux se user (jisme token hai) nikal rahe hain
  const { user } = useSelector((state) => state.auth);

  // 👈 NAYA LOGIC: Token ko decode karke naam nikalna
  let decodedName = "";
  if (user && user.token) {
    try {
      const decodedToken = jwtDecode(user.token);
      decodedName = decodedToken.name; // Backend se jo 'name' token mein daala tha, wo yahan mil jayega
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
<header className="border-b border-[#8b8b8b] bg-white">
  <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
    
    <h1 className="text-xl font-bold">
      MyTodo
    </h1>
    
    {/* Agar user hai (yani logged in hai) tabhi yeh section dikhayein */}
    {user && (
      <div className="flex items-center gap-4">
        <span className="text-sm hidden sm:inline-block">
          Welcome, <strong>{decodedName}</strong>
        </span>
        
        <button
          onClick={onLogout}
          className="px-4 py-1.5 text-sm font-semibold border border-[#2b2b2b] rounded-[4px] bg-white text-black hover:bg-black hover:text-white transition-colors focus:outline-none"
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