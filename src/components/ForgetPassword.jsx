import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import ContactMailIcon from "@mui/icons-material/ContactMail";
function ForgetPassword() {
  const baseUrl = import.meta.env.VITE_SOME_KEY;
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);

  const submitForm = async (e) => {
    e.preventDefault();
    if (email.trim() === "") {
      toast("يجب إدخال البريد الإلكتروني", { type: "error" });
      return;
    }
    try {
      setLoader(true);
      const res = await axios.post(`${baseUrl}forget-password`, {
        email: email,
      });

      if (res.status === 200) {
        toast("تم إرسال رسالة إلي البريد الإلكتروني الخاص بك", {
          type: "success",
        });
      }
    } catch (error) {
      console.log(error);
      toast("يجب كتابة البريد الإلكتروني الخاص بك  ", { type: "error" });
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="container flex flex-col items-center justify-center min-h-screen px-6 mx-auto">
          <div className="flex justify-center bg-blue-500 rounded-full p-4 w-fit mx-auto">
            <ContactMailIcon sx={{ fontSize: 55, color: "white" }} />
          </div>
          <p className="mt-4 text-lg font-semibold tracking-wide text-center text-gray-800 capitalize dark:text-white">
            توجه إلي البريد الإلكتروني الحاص بك عند إرسال الرسالة
          </p>

          <div className="w-full max-w-md mx-auto mt-6">
            <form className="w-full max-w-md">
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
                  className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  placeholder="البريد الإلكتروني "
                />
              </div>
              <div className="text-right">
                <Link to="/login">
                  <span className="text-sm  inline-block  font-bold  text-white border-b-2 pt-8  hover:cursor-pointer transition duration-200">
                    تذكرت كلمة السر ؟{" "}
                  </span>
                </Link>
              </div>

              <div className="mt-6">
                <button
                  onClick={(e) => submitForm(e)}
                  className="w-full px-6 py-3 text-lg font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                  إرسال
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
    </>
  );
}

export default ForgetPassword;
