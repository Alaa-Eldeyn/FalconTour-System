import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { z } from "zod";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function Reports() {
  const baseUrl = import.meta.env.VITE_SOME_KEY;
  const [loader, setLoader] = useState(true);
  const Navigate = useNavigate();
  const [data, setData] = useState([]);
  const userToken = localStorage.getItem("user_token");
  const userRoleName = localStorage.getItem("user_role_name");

  const schema = z.object({
    from: z.string().min(1, { message: "أدخل تاريخ البداية" }),
    to: z.string().min(1, { message: "أدخل تاريخ النهاية" }),
  });
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const handleUnauthenticated = () => {
    toast("يجب عليك تسجيل الدخول مرة ثانية لانتهاء الصلاحية", {
      type: "error",
      autoClose: 4000,
    });
    Navigate("/login");
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_role_name");
  };

  useEffect(() => {
    dailyReport();
  }, []);

  const onSubmit = () => {
    setLoader(true);
    axios
      .post(
        `${baseUrl}report/between-days`,
        {
          from: getValues("from"),
          to: getValues("to"),
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        setData(res.data.data);
        reset();
      })
      .catch((error) => {
        if (
          error.response.data.message === "The to must be a date after from."
        ) {
          toast("من فضلك قيمة التاريخ المدخلة خطأ");
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const dailyReport = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}report/daily`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setLoader(false);
        setData(response.data.data);
      })
      .catch(function (error) {
        if (error.response?.data?.message === "Unauthenticated.") {
          handleUnauthenticated();
        } else {
          console.error(error, "error");
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-300 p-9 rounded-xl">
      <h1 className="text-center text-3xl font-bold text-gray-900 -mb-5 underline underline-offset-8 decoration-blue-500">
        الصندوق اليومي
      </h1>
      <form className="flex justify-center mt-10 gap-5 items-center">
        <div className="flex-grow ">
          <label className=" text-2xl text-center font-bold"> من</label>
          <input
            type="date"
            {...register("from")}
            className="text-xl w-full mt-3 p-2 rounded-lg text-center border-2 border-slate-500  text-black"
          />
          {errors && (
            <span className="text-red-500 text-sm">{errors.from?.message}</span>
          )}
        </div>
        <div className="flex-grow ">
          <label className=" text-2xl font-bold"> إلي </label>
          <input
            type="date"
            {...register("to")}
            className="text-xl w-full  mt-3 p-2 rounded-lg text-center border-2 border-slate-500  text-black"
          />
          {errors && (
            <span className="text-red-500 text-sm">{errors.to?.message}</span>
          )}
        </div>
        <div className="flex-grow ">
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="py-3 px-5 w-full font-bold text-lg bg-gray-500 hover:bg-gray-900 transition rounded-lg text-white h-fit mt-12"
          >
            بحث
          </button>
        </div>
      </form>
      <>
        <button
          className="mt-9 bg-slate-700 text-white p-3 rounded-xl font-bold hover:bg-gray-500"
          onClick={handlePrint}
        >
          <LocalPrintshopIcon />
          طباعة التقارير
        </button>
        <div className="text-center mt-10 bg-slate-700 text-white p-3 text-lg font-bold  rounded-sm">
          التحصيل اليومي
          <CurrencyExchangeIcon sx={{ fontSize: 40, mx: 2 }} />
        </div>
        <table className="border-collapse w-full ">
          <thead>
            <tr>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                الترتيب
              </th>
              {userRoleName === "super_admin" && (
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  الفرع
                </th>
              )}
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                التحصيل اليومي
              </th>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                العملة
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              return (
                <tr
                  key={index}
                  className="bg-white lg:hover:bg-gray-200 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0"
                >
                  <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                    {index + 1}
                  </td>
                  {userRoleName === "super_admin" && (
                    <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                      {item.brnach?.name}
                    </td>
                  )}
                  <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                    {item.totoalCost}
                  </td>
                  <td className="w-full lg:w-auto p-2 text-gray-800   border border-b text-center block lg:table-cell relative lg:static">
                    {item.currency?.name}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {data.length === 0 && (
          <p className="mx-auto w-full p-3 text-lg text-center my-7 bg-gray-600  text-white rounded-lg  ">
            لايوجد بيانات للعرض وذلك لأنه لم يتم حجز أي رحلة أو خدمة خلال اليوم
          </p>
        )}
      </>
      {loader && (
        <>
          <div className="fixed bg-black/30 top-0 left-0 w-screen h-screen"></div>
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
        </>
      )}
    </div>
  );
}
export default Reports;
