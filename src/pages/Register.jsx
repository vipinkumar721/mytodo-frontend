import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register, reset } from '../redux/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      toast.success('Registration Successful!');
      navigate('/'); // Register hone ke baad Home par bhejenge
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

const onSubmit = (e) => {
    e.preventDefault();
    
    // 1. Check karein ki koi field khali toh nahi
    if (!name || !email || !password) {
      return toast.warning('Please fill all fields');
    }

    // 2. Name Validation (Min 3 characters)
    if (name.trim().length < 3) {
      return toast.error('Name must be at least 3 characters long');
    }

    // 3. Password Validation (Min 6 characters)
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    // Agar sab sahi hai, tabhi backend ko request bhejein
    const userData = { name, email, password };
    dispatch(register(userData));
  };

  return (
   <div className="flex h-screen w-full items-center justify-center bg-emerald-50 px-4">
  <div className="text-center w-full max-w-lg">
    {/* Exterior Heading Section */}
    <h2 className="text-4xl font-extrabold text-emerald-900 mb-2">Create your account</h2>
    <p className="text-sm text-gray-600 mb-6">Start organizing your thoughts and ideas today</p>

    {/* Main Sign Up Card */}
    <div className="w-full bg-white p-7 rounded-2xl shadow-xl shadow-gray-200 border border-gray-100">
      
      {/* Form Content */}
      <h3 className="text-2xl font-bold text-gray-900 text-center mb-1">Sign up</h3>
      <p className="text-sm text-gray-500 text-center mb-5">Create your account to get started with NotesApp</p>
      
      <form onSubmit={onSubmit} className="space-y-4 text-left">
        {/* Full Name Field */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1 text-left">Full Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            placeholder="Enter your full name"
            className="w-full p-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1 text-left">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="Enter your email"
            className="w-full p-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
          />
        </div>
        
        {/* Password Field */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1 text-left">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Create a password"
            className="w-full p-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
          />
        </div>
        
        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white p-2.5 rounded-xl font-semibold shadow-md hover:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:bg-emerald-300"
          >
            {isLoading ? 'Registering...' : 'Create account'}
          </button>
        </div>
      </form>
      
      {/* Footer Login Link */}
      <div className="mt-5 pt-4 text-center border-t border-gray-100">
        <p className="text-sm text-gray-600">
          Already have an account? <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  </div>
</div>
  );
};

export default Register;