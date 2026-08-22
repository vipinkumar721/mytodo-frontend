import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { register, reset } from "../redux/authSlice";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: sessionStorage.getItem("draftName") || "",
    email: location.state?.email || sessionStorage.getItem("draftEmail") || "",
    password: "",
  });

  const { name, email, password } = formData;
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  
  useEffect(() => {
    sessionStorage.setItem("draftName", name);
    sessionStorage.setItem("draftEmail", email);
  }, [name, email]);

  
  useEffect(() => {

    if (isError) {
      toast.error(message);
      dispatch(reset());
    }

    // Registration successfully
    if (isSuccess) {
      toast.success("Registration Successful! Please login to continue.");
      sessionStorage.removeItem("draftName");
      sessionStorage.removeItem("draftEmail");

      dispatch(reset()); 
      navigate("/login");
    }
  }, [isError, isSuccess, message, navigate, dispatch]);

  // Validation Checks
  const hasCapitalLetter = /[A-Z]/.test(email);
  const hasValidDomain = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.(com|in)$/.test(email);
  const isEmailValid = !hasCapitalLetter && hasValidDomain;
  const isPasswordValid =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password,
    );

    
  const isFormValid =
    name.trim().length >= 3 && isEmailValid && isPasswordValid;

  const handleKeyUp = (e) => {
    setCapsLockActive(e.getModifierState("CapsLock"));
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    
    if (!isFormValid) return;

    // Alert confirmation show 
    const wantToRegister = window.confirm(
      `Are you sure you want to create an account with this email (${email})?`,
    );

    if (wantToRegister) {
      dispatch(register({ name, email, password }));
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-emerald-50 px-4">
      <div className="text-center w-full max-w-lg">
        <h2 className="text-4xl font-extrabold text-emerald-900 mb-2">
          Create account
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Start organizing your thoughts today
        </p>

        <div className="w-full bg-white p-7 rounded-2xl shadow-xl shadow-gray-200 border border-gray-100">
          <form onSubmit={onSubmit} className="space-y-4 text-left">
            {/* Name Field */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={name}
                placeholder="Enter your full name"
                onChange={onChange}
                onKeyUp={handleKeyUp}
                className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                placeholder="Enter your email"
                onChange={onChange}
                onKeyUp={handleKeyUp}
                className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
              />

              {/* Email Error Message */}
              {email && !isEmailValid && (
                <p className="text-xs text-red-500 mt-1.5 font-semibold">
                  ❌ Email must be lowercase and end with .com & .in (e.g.,
                  user@gmail.com).
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  placeholder="Enter your password"
                  onChange={onChange}
                  onKeyUp={handleKeyUp}
                  className="w-full p-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none pr-10 transition-all duration-200"
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

              {/* Caps Lock Warning */}
              {capsLockActive && (
                <p className="text-xs text-orange-500 font-bold mt-1.5">
                  ⚠️ Caps Lock is ON
                </p>
              )}

              {/* Password Rules Message */}
              <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs">
                <p className="text-blue-800 font-medium leading-relaxed">
                  <span className="font-bold">Password Tips:</span> Use at least
                  8 characters with 1 uppercase letter, 1 lowercase letter, 1
                  number, and 1 special character (@$!%*?&).
                </p>
              </div>

              {/* Password Dynamic Error */}
              {password && !isPasswordValid && (
                <p className="text-xs text-red-500 mt-1.5 font-semibold">
                  ❌ Password does not meet the required strength rules.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full p-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  isFormValid
                    ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md cursor-pointer active:bg-emerald-800"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? "Registering..." : "Create account"}
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-6 pt-5 text-center border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
