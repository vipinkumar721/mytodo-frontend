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

  // 👈 Auto-lowercase hata diya gaya hai
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
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-sm border border-[#8b8b8b] rounded-[8px] p-6 bg-white">
        <h2 className="text-2xl text-center font-bold mb-2">Log In</h2>
        <p className="text-sm text-center mb-6">
          Enter your details to continue.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block mb-1 text-sm font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              onKeyUp={handleKeyUp}
              placeholder="Enter your email"
              className="w-full p-2 border border-[#2b2b2b] rounded-[4px] focus:outline-none"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block mb-1 text-sm font-semibold">Password</label>
            <div className="flex border border-[#2b2b2b] rounded-[4px] focus:outline-none">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={onChange}
                onKeyUp={handleKeyUp}
                placeholder="Enter password"
                className="w-full p-2 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-3  rounded-[4px] focus:outline-none text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {capsLockActive && (
              <p className="text-[12px] text-red-500 font-bold mt-1">
                Caps Lock is ON
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white p-2 font-semibold hover:bg-white hover:text-black disabled:bg-gray-400 border border-[#2b2b2b] rounded-[4px]"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="pt-4 text-sm text-center">
          Don't have an account?{" "}
          <Link to="/register" className="pl-1 text-blue-600">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
