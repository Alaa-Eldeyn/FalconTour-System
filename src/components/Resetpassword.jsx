import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import LoginIcon from "@mui/icons-material/Login";
import axios from "axios";
function Resetpassword() {
  const baseUrl = import.meta.env.VITE_SOME_KEY;
  const [loader, setLoader] = useState(false);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const navigate = useNavigate();

  const queryString = window.location.search;
  const token = new URLSearchParams(queryString).get("token");
  const submitForm = async (e) => {
    e.preventDefault();
    if (password1 === "" || password2 === "") {
      toast("من فضلك اكتب كلمة السر", { type: "error" });
      return;
    }

    if (password1.trim() !== password2.trim()) {
      toast("كلمة المرور غير متطابقة", { type: "error" });
      return;
    }
    try {
      setLoader(true);
      const res = await axios.post(
        `${baseUrl}reset-password`,
        {
          password: password1,
          password_confirmation: password2,
          token: token,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        navigate("/login");
        toast("تم تغيير كلمة المرور بنجاح", { type: "success" });
      }
    } catch (error) {
      if (
        error.response.data.message ===
        "The password must be at least 6 characters."
      ) {
        toast("يجب ألا تقل كلمة المرور عن 6 أرقام", { type: "error" });
      }
      toast(error, { type: "error" });
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container flex flex-col items-center justify-center min-h-screen px-6 mx-auto">
        <div className="flex justify-center bg-blue-500 rounded-full p-3 w-fit mx-auto">
          <LoginIcon sx={{ fontSize: 50, color: "white" }} />
        </div>
        <p className="mt-4 text-sm font-semibold tracking-wide text-center text-gray-800 capitalize dark:text-white">
          ادخل كلمة المرور الجديدة
        </p>

        <div className="w-full max-w-md mx-auto mt-6">
          <form className="w-full max-w-md">
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
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="كلمة السر الجديدة"
              />
            </div>

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
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="تاكيد كلمة السر الجديدة"
              />
            </div>
            <div className="text-right">
              <Link to="/Login">
                <span className="text-sm  inline-block  font-bold  text-white py-5  hover:cursor-pointer transition duration-200">
                  تذكرت كلمة السر ؟{" "}
                </span>
              </Link>
            </div>

            <div className="mt-6">
              <button
                onClick={(e) => submitForm(e)}
                className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
              >
                تأكيد
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
      </div>
    </section>
  );
}

export default Resetpassword;
