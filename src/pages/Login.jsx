import { useState } from "react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.auth);

  
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleKeyUp = (e) => {
    setCapsLockActive(e.getModifierState("CapsLock"));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.warning("Please fill all fields");
    }

    if (password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    dispatch(login({ email, password }))
      .unwrap()
      .then(() => {
        toast.success("Login Successful!");
        navigate("/");
      })
      .catch((error) => {
        dispatch(reset());

        if (error === "USER_NOT_FOUND") {
          const wantToRegister = window.confirm(
            "This email is not registered. Would you like to create a new account with this email?",
          );
          if (wantToRegister) {
            navigate("/register", { state: { email } });
          }
        } else if (error === "Invalid email or password") {
          toast.error("Incorrect password! Please enter the correct password.");
        } else {
          toast.error(error || "Login failed!");
        }
      });
  };

  return (
   <div className="flex h-screen w-full items-center justify-center bg-emerald-50 px-4">
  <div className="text-center w-full max-w-lg">
    <h2 className="text-4xl font-extrabold text-emerald-900 mb-2">
      Welcome back
    </h2>
    <p className="text-sm text-gray-600 mb-8">
      Enter your details to continue
    </p>

    <div className="w-full bg-white p-8 rounded-2xl shadow-xl shadow-gray-200 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 text-center mb-1">
        Log In
      </h3>
      <p className="text-sm text-gray-500 text-center mb-6">
        Securely login to your account
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
            onKeyUp={handleKeyUp}
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
          />
        </div>

        {/* Password Field */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5 text-left">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={onChange}
              onKeyUp={handleKeyUp}
              placeholder="Enter password"
              className="w-full p-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 pr-10"
            />
            <button
                  type="button"
                  // Desktop Events
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  // Mobile Touch Events
                  onTouchStart={() => setShowPassword(true)}
                  onTouchEnd={() => setShowPassword(false)}
                  className="absolute right-3 top-3 text-sm text-gray-500 hover:text-emerald-600 focus:outline-none select-none transition-colors"
                >
                  Show
                </button>
          </div>

          {capsLockActive && (
            <p className="text-xs text-orange-500 font-bold mt-1.5">
              ⚠️ Caps Lock is ON
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white p-3 rounded-xl font-semibold shadow-md hover:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:bg-emerald-300"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </div>
      </form>

      {/* Footer Link */}
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
