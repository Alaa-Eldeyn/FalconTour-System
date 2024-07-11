import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import logo from "../assets/Logo.png";
function Login() {
  const baseUrl = import.meta.env.VITE_SOME_KEY;
  const Navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accept, setAccept] = useState(false);
  const [loader, setLoader] = useState(false);

  const submitForm = async (e) => {
    e.preventDefault();
    setAccept(true);
    if (email === "" || password.length < 5) {
      return;
    }
    setLoader(true);
    try {
      const res = await axios.post(`${baseUrl}login`, {
        email: email,
        password: password,
      });
      setLoader(false);
      if (res.status === 200) {
        localStorage.setItem("user_token", res.data.access_token);
        localStorage.setItem("user_role_name", res.data.user.role_name);
        Navigate("/dashboard");
        toast("تم تسجيل الدخول بنجاح", { type: "success" });
      }
    } catch (error) {
      if (error.response.data.error === "Unauthorized") {
        toast("هذا المستخدم غير مسموح له بالدخول", { type: "error" });
      }
      setLoader(false);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
        <form
          className="w-full max-w-md"
          onSubmit={(e) => submitForm(e)}
          dir="rtl"
        >
          <div className="logo absolute top-4  left-1/2 -translate-x-1/2 flex justify-center items-center ">
            <img src={logo} alt="logo" className="w-80 pt-2 text-white" />
          </div>
          <div className="flex justify-center bg-blue-500 rounded-full p-3 w-fit mx-auto">
            <LockOpenIcon sx={{ fontSize: 40, color: "white" }} />
          </div>
          <h1 className="text-center mt-3 text-2xl font-semibold text-gray-800 capitalize sm:text-3xl dark:text-white">
            تسجيل الدخول
          </h1>
          <div className="relative flex items-center mt-8">
            <span className="absolute">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full py-4 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              placeholder="البريد الإلكتروني "
            />
          </div>
          {email == "" && accept && (
            <p className="text-red-600 my-5">الرجاء إدخال البريد الإلكتروني</p>
          )}

          <div className="relative flex items-center mt-4">
            <span className="absolute">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-10 py-4 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              placeholder="كلمة السر "
            />
          </div>
          {password === "" && accept && (
            <p className="text-red-600 my-5">الرجاء إدخال كلمة السر</p>
          )}
          {password.length > 0 && password.length < 5 && accept && (
            <p className="text-red-600 my-5">يجب ألا تقل كلمة السر عن 6أحرف</p>
          )}
          <div className="text-right">
            <Link to="/forget_password">
              <span className="text-sm border-b-2  inline-block  font-bold  text-white pt-7  hover:cursor-pointer transition duration-200">
                هل نسيت كلمة السر ؟
              </span>
            </Link>
          </div>
          <div className="mt-6">
            <button className="w-full px-6 py-3 text-lg font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
              سجل الدخول
            </button>
          </div>
        </form>

        {loader && (
          <svg
            id="loading-spinner"
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            viewBox="0 0 48 48"
          >
            <g fill="none">
              <path
                id="track"
                fill="#C6CCD2"
                d="M24,48 C10.745166,48 0,37.254834 0,24 C0,10.745166 10.745166,0 24,0 C37.254834,0 48,10.745166 48,24 C48,37.254834 37.254834,48 24,48 Z M24,44 C35.045695,44 44,35.045695 44,24 C44,12.954305 35.045695,4 24,4 C12.954305,4 4,12.954305 4,24 C4,35.045695 12.954305,44 24,44 Z"
              />
              <path
                id="section"
                fill="#3F4850"
                d="M24,0 C37.254834,0 48,10.745166 48,24 L44,24 C44,12.954305 35.045695,4 24,4 L24,0 Z"
              />
            </g>
          </svg>
        )}
      </div>
    </section>
  );
}

export default Login;
