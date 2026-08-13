import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { login, reset } from "../redux/authSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  // useEffect(() => {
  //   if (isError) {
  //     toast.error(message);
  //   }
  //   if (isSuccess || user) {
  //     toast.success("Login Successful!");
  //     navigate("/"); // Login hone ke baad Home par bhejenge
  //   }
  //   dispatch(reset());
  // }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

const onSubmit = (e) => {
    e.preventDefault();

    // 1. Basic empty field check
    if (!email || !password) {
      return toast.warning("Please fill all fields");
    }

    // 2. Email Lowercase Validation (NEW)
    // Yeh regex check karega ki email string mein koi capital letter (A-Z) toh nahi hai
    if (/[A-Z]/.test(email)) {
      return toast.error("Email must be in lowercase only!");
    }

    // 3. Password length validation
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    const userData = { email, password };

    // 👇 API Call dispatch
    dispatch(login(userData))
      .unwrap() // 👈 Ye Redux Toolkit ka function backend errors ko catch karta hai
      .then((response) => {
        // Agar login sahi ho gaya
        toast.success("Login Successful!");
        navigate("/");
        // (Aap chaho toh yahan user ko Home page par navigate kar sakte ho)
      })
      .catch((error) => {
        // Agar backend ne galat password/email ka error bheja
        toast.error(error || "Invalid email or password!");
      });
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-emerald-50 px-4">
      <div className="text-center w-full max-w-lg">
        {/* Exterior Heading Section */}
        <h2 className="text-4xl font-extrabold text-emerald-900 mb-2">
          Welcome back
        </h2>
        <p className="text-sm text-gray-600 mb-8">
          Sign in to your account to continue taking notes
        </p>

        {/* Main Login Card */}
        <div className="w-full bg-white p-8 rounded-2xl shadow-xl shadow-gray-200 border border-gray-100">
          {/* Form Content */}
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-1">
            Log In
          </h3>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your email and password to access your notes
          </p>

          <form onSubmit={onSubmit} className="space-y-5 text-left">
            {/* Email Field */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5 text-left">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5 text-left">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Enter a password"
                className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              />
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 text-white p-3 rounded-xl font-semibold shadow-md hover:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:bg-emerald-300"
              >
                {isLoading ? "Log Into Account..." : "Log Into Account"}
              </button>
            </div>
          </form>

          {/* Footer Signup Link */}
          <div className="mt-6 pt-5 text-center border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
