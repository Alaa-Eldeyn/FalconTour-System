import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import { Link, useNavigate } from "react-router-dom";
function DailyClientsReports() {
  const baseUrl = import.meta.env.VITE_SOME_KEY;
  const [loader, setLoader] = useState(true);
  const Navigate = useNavigate();
  const [data, setData] = useState([]);
  const userToken = localStorage.getItem("user_token");

  useEffect(() => {
    dailyReport();
  }, []);

  const handleUnauthenticated = () => {
    toast("يجب عليك تسجيل الدخول مرة ثانية لانتهاء الصلاحية", {
      type: "error",
      autoClose: 4000,
    });
    Navigate("/login");
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_role_name");
  };

  const dailyReport = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}report/client-report-daily`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setData(response.data.data.info);
        setLoader(false);
      })
      .catch(function (error) {
        if (error.response.data.message === "Unauthenticated.") {
          handleUnauthenticated();
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
      <div className="w-full mb-5">
        <Link
          className="bg-gray-500 text-white float-left p-2 rounded-lg hover:bg-gray-700 hover:shadow-lg transition duration-200"
          to="/dashboard/clients_report/range_clients_reports"
        >
          انتقل إلى تقارير العملاء خلال فترة محددة
        </Link>
        <div className="text-3xl font-bold text-gray-900 -mb-5 underline underline-offset-8 decoration-blue-500">
          <PeopleOutlineIcon sx={{ fontSize: 50 }} />
          التقارير اليومية للعملاء
        </div>
      </div>

      <>
        <button
          className="mt-9 bg-slate-700 text-white p-3 rounded-xl font-bold hover:bg-gray-500"
          onClick={handlePrint}
        >
          <LocalPrintshopIcon />
          طباعة التقارير
        </button>
        <table className="border-collapse w-full mt-16 text-sm">
          <thead>
            <tr>
              {[
                "الترتيب",
                "اسم العميل",
                "رقم الموبايل",
                "العنوان",
                "الجنسية",
                "الفرع",
                "وقت تسجيل العميل",
                "الإيميل ",
                "نوع الحجز",
                "التكلفة",
              ].map((header, index) => (
                <th
                  key={index}
                  className="px-3 py-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          {data.map((client, index) => {
            return (
              <tbody key={index}>
                <tr className="bg-white text-center   lg:hover:bg-gray-200 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0">
                  <td className="w-full lg:w-auto p-2 text-gray-800 border border-b text-center block lg:table-cell relative lg:static">
                    <span className="rounded px-2 text-sm font-bold">
                      {index + 1}
                    </span>
                  </td>
                  <td className="w-full lg:w-auto p-2 text-white bg-red-400  border border-b text-center block lg:table-cell relative lg:static">
                    <span className="rounded  text-sm font-bold">
                      {client?.client?.name}
                    </span>
                  </td>
                  <td className="w-full lg:w-auto p-2 text-gray-800 border border-b text-center block lg:table-cell relative lg:static">
                    <span className="rounded py-1 text-sm font-bold">
                      {client?.client?.phone_number}
                    </span>
                  </td>
                  <td className="w-full lg:w-auto p-2    border border-b text-center block lg:table-cell relative lg:static">
                    <span className="rounded py-1 px-3 text-sm font-bold">
                      {client?.client?.address}
                    </span>
                  </td>
                  <td className="w-full lg:w-auto p-2 text-gray-800 border border-b text-center block lg:table-cell relative lg:static">
                    <span className="rounded py-1  text-sm font-bold">
                      {client?.client?.nationality?.nationality}
                    </span>
                  </td>
                  <td className="w-full lg:w-auto p-2 text-white bg-red-400  border border-b text-center block lg:table-cell relative lg:static">
                    <span className="rounded py-1  text-sm font-bold">
                      {client?.client?.branch?.branch_name}
                    </span>
                  </td>
                  <td className="w-full lg:w-auto p-2 text-gray-800 border border-b text-center block lg:table-cell relative lg:static">
                    <span className="rounded py-1  text-sm font-bold">
                      {client?.client?.created_at}
                    </span>
                  </td>
                  <td className="w-full lg:w-auto p-2 text-gray-800 border border-b text-center block lg:table-cell relative lg:static">
                    <span className="rounded py-1 text-sm font-bold">
                      {client?.client?.email}
                    </span>
                  </td>
                  <td className="w-full lg:w-auto p-2 text-gray-800 border border-b text-center block lg:table-cell relative lg:static">
                    <span className="rounded py-1  text-sm font-bold">
                      {client?.bookingTrip === null
                        ? "حجز خدمة"
                        : client?.bookingService === null
                          ? "حجز رحلة"
                          : "حجز رحلة"}
                    </span>
                  </td>
                  <td className="w-full lg:w-auto p-2 text-white bg-red-400  border border-b text-center block lg:table-cell relative lg:static">
                    <span className="rounded py-1 px-3 text-sm font-bold">
                      {client?.cost}
                    </span>
                  </td>
                </tr>
              </tbody>
            );
          })}
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
export default DailyClientsReports;
