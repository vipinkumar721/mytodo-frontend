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
    if (isError) toast.error(message);
    if (isSuccess || user) {
      toast.success("Registration Successful! Please login to continue.");
      sessionStorage.removeItem("draftName");
      sessionStorage.removeItem("draftEmail");

      navigate("/login");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  // Validation Checks
  const hasCapitalLetter = /[A-Z]/.test(email);
  const hasValidDomain = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.com$/.test(email);
  const isEmailValid = !hasCapitalLetter && hasValidDomain;
  const isPasswordValid =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password,
    );

  // Jab teeno chije sahi hongi tabhi isFormValid 'true' hoga
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

    // Agar form valid nahi hai toh submit hone hi nahi dega
    if (!isFormValid) return;

    // Alert confirmation show karega
    const wantToRegister = window.confirm(
      `Are you sure you want to create an account with this email (${email})?`,
    );

    if (wantToRegister) {
      dispatch(register({ name, email, password }));
    }
  };

  return (
<div className="flex h-screen w-full items-center justify-center p-4">
  <div className="w-full max-w-sm border border-[#8b8b8b] rounded-[8px] p-6 bg-white">
    
    <h2 className="text-2xl text-center font-bold mb-2">
      Create account
    </h2>
    <p className="text-sm text-center mb-6">
      Start organizing your thoughts today.
    </p>

    <form onSubmit={onSubmit} className="space-y-4 text-left">
      {/* Name Field */}
      <div>
        <label className="block mb-1 text-sm font-semibold">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={name}
          placeholder="Enter your full name"
          onChange={onChange}
          onKeyUp={handleKeyUp}
          className="w-full p-2 border border-[#2b2b2b] rounded-[4px] focus:outline-none text-[15px]"
        />
      </div>

      {/* Email Field */}
      <div>
        <label className="block mb-1 text-sm font-semibold">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={email}
          placeholder="Enter your email"
          onChange={onChange}
          onKeyUp={handleKeyUp}
          className="w-full p-2 border border-[#2b2b2b] rounded-[4px] focus:outline-none text-[15px]"
        />

        {/* Email Error Message */}
        {email && !isEmailValid && (
          <p className="text-[12px] text-red-500 font-bold mt-1">
            Email must be lowercase and end with .com (e.g., user@gmail.com).
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label className="block mb-1 text-sm font-semibold">
          Password
        </label>
        <div className="flex border border-[#2b2b2b] rounded-[4px] focus:outline-none">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={onChange}
            onKeyUp={handleKeyUp}
            className="w-full p-2 outline-none text-[15px]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="px-3 rounded-[4px] focus:outline-none text-sm"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Caps Lock Warning */}
        {capsLockActive && (
          <p className="text-[12px] text-red-500 font-bold mt-1">
            Caps Lock is ON
          </p>
        )}

        {/* Password Rules Box */}
        <div className="mt-2 p-2 border border-[#d9d9d9] rounded-[4px] text-[12px]">
          <p className="font-semibold text-[#424242]">
            <span className="font-bold">Password Tips:</span> Use at least 8 characters with 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&).
          </p>
        </div>

        {/* Password Dynamic Error */}
        {password && !isPasswordValid && (
          <p className="text-[12px] text-red-500 font-bold mt-1">
            Password does not meet the required strength rules.
          </p>
        )}
      </div>

      {/* Submit Button (Cursor Not Allowed added here) */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="w-full bg-black text-white p-2 font-semibold hover:bg-white hover:text-black disabled:bg-gray-400 disabled:text-black disabled:cursor-not-allowed disabled:border-gray-400 border border-[#2b2b2b] rounded-[4px] transition-colors"
        >
          {isLoading ? "Registering..." : "Create account"}
        </button>
      </div>
    </form>

    {/* Footer Link */}
    <div className="pt-4 text-sm text-center">
      Already have an account?{" "}
      <Link to="/login" className="pl-1 text-blue-600">
        Sign in
      </Link>
    </div>
    
  </div>
</div>
  );
};

export default Register;
