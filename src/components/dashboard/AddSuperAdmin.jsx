import axios from "axios";
import { useState, useEffect } from "react";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import ReactPaginate from "react-paginate";
import SearchIcon from "@mui/icons-material/Search";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ScrollUp } from "../ScrollUp";

function AddSuperAdmin() {
  const baseUrl = import.meta.env.VITE_SOME_KEY;
  const userToken = localStorage.getItem("user_token");
  const [updateMode, setUpdateMode] = useState(false);
  const [loader, setLoader] = useState(true);
  const [managers, setManagers] = useState([]);
  const [filteredManagers, setFilteredManagers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [updateManagerID, setUpdateManagerID] = useState("");

  const schema = z
    .object({
      name: z.string().min(1, "الاسم يجب ان يكون 3 احرف على الاقل"),
      email: z
        .string()
        .min(1, { message: "البريد الالكترونى مطلوب" })
        .email("البريد الالكترونى غير صحيح"),
      password: z.string().min(6, "كلمة المرور يجب ان تكون 6 احرف على الاقل"),
      password_confirmation: z
        .string()
        .min(6, "كلمة المرور يجب ان تكون 6 احرف على الاقل"),
      phone_number: z.string().min(11, "رقم الهاتف يجب ان يكون 11 رقم"),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: "كلمة المرور غير متطابقة",
      path: ["password_confirmation"],
    });
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    getAllManagers();
  }, []);

  const getAllManagers = async () => {
    setLoader(true);
    await axios
      .get(`${baseUrl}managers`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setLoader(false);
        setManagers(response.data.data);
        setFilteredManagers(response.data.data);
      })
      .catch(function (error) {
        console.error("Error refreshing token:", error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const storeManager = () => {
    setLoader(true);
    const managerData = {
      name: getValues("name"),
      email: getValues("email"),
      password: getValues("password"),
      password_confirmation: getValues("password_confirmation"),
      phone_number: getValues("phone_number"),
    };
    axios
      .post(`${baseUrl}managers`, managerData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function () {
        toast.success("تم تسجيل السوبر أدمن بنجاح");
        getAllManagers();
        reset();
      })
      .catch(function (error) {
        if (
          error.response.data.message === "The email has already been taken."
        ) {
          toast.error("السوبر أدمن موجود بالفعل");
        }
        console.error("Error fetching", error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const deleteManager = (id) => {
    setLoader(true);
    axios
      .delete(`${baseUrl}managers/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function () {
        toast.success("تم حذف السوبر أدمن بنجاح");
        getAllManagers();
        reset();
      })
      .catch(function (error) {
        if (
          error.response.data.Message === "Not Found Or not Allow to Remove It"
        ) {
          toast.error("لا يمكن  حذف سوبر أدمن");
        }
        console.log(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleManagerUpdate = () => {
    setLoader(true);
    axios
      .post(
        `${baseUrl}managers/${updateManagerID}`,
        {
          name: getValues("name"),
          email: getValues("email"),
          password: getValues("password"),
          password_confirmation: getValues("password_confirmation"),
          phone_number: getValues("phone_number"),
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(function () {
        toast.success("تم تحديث البيانات بنجاح");
        getAllManagers();
        setUpdateMode(false);
        reset();
      })
      .catch(function (error) {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    if (searchValue === "") {
      setFilteredManagers(managers);
    } else {
      setFilteredManagers(
        managers.filter((item) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
  }, [searchValue, managers]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    fetchPagination();
  }, [currentPage]);
  const fetchPagination = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}managers?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setManagers(response.data.data);
        setFilteredManagers(response.data.data);
        setTotalPages(response.data.meta.pagination.last_page);
      })
      .catch(function (error) {
        console.error("Error fetching managers:", error);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  return (
    <div className="items-center justify-center">
      {/* store managers */}
      <div className="mx-auto w-full bg-slate-700 p-3  rounded-sm mb-9">
        <form className=" space-y-3">
          <div className=" flex flex-wrap gap-3">
            <div className="w-[49%] flex-grow">
              <input
                type="text"
                {...register("name")}
                placeholder="اسم السوبر أدمن"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
              {errors && (
                <span className="text-red-500 text-sm">
                  {errors.name?.message}
                </span>
              )}
            </div>
            <div className="w-[49%] flex-grow">
              <input
                type="email"
                {...register("email")}
                placeholder="البريد الإلكترونى"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
              {errors && (
                <span className="text-red-500 text-sm">
                  {errors.email?.message}
                </span>
              )}
            </div>
          </div>
          <div className=" flex flex-wrap gap-3">
            <div className="w-[49%] flex-grow">
              <input
                type="password"
                {...register("password")}
                placeholder="كلمة المرور"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
              {errors && (
                <span className="text-red-500 text-sm">
                  {errors.password?.message}
                </span>
              )}
            </div>
            <div className="w-[49%] flex-grow">
              <input
                type="password"
                {...register("password_confirmation")}
                placeholder="تأكيد كلمة المرور"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
              {errors && (
                <span className="text-red-500 text-sm">
                  {errors.password_confirmation?.message}
                </span>
              )}
            </div>
          </div>
          <div className=" flex flex-wrap gap-3">
            <div className="w-[49%] flex-grow">
              <input
                type="tel"
                {...register("phone_number")}
                placeholder="رقم الهاتف"
                dir="rtl"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
              {errors && (
                <span className="text-red-500 text-sm">
                  {errors.phone_number?.message}
                </span>
              )}
            </div>
          </div>

          <div>
            {updateMode ? (
              <button
                onClick={handleSubmit(handleManagerUpdate)}
                disabled={isSubmitting}
                className="text-center text-xl mb-3 mt-6 p-3 w-55 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
              >
                تحديث بيانات السوبرأدمن
              </button>
            ) : (
              <button
                onClick={handleSubmit(storeManager)}
                disabled={isSubmitting}
                className="text-center text-xl mb-3 mt-6 p-3 w-55 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
              >
                تسجيل سوبر أدمن جديد
              </button>
            )}
          </div>
        </form>
      </div>
      {/* seasrch manager */}
      <div className="my-3">
        <div className="w-full relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <SearchIcon className="text-white" />
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={`ابحث عن سوبر أدمن  بالاسم`}
            required
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      {/* show managers */}
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              الترتيب
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              الاسم
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              البريد الإلكتروني
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              رقم الهاتف
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              التاريخ / وقت الإنشاء
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              تعديل البيانات
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredManagers.map((manager, index) => {
            const { id, name, email, phone_number, created_at } = manager;
            const tableIndex = (currentPage - 1) * 15 + index + 1;
            return (
              <tr
                key={id}
                className="bg-white lg:hover:bg-gray-200 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0"
              >
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  {tableIndex}
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  {name}
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-2 text-xs font-bold">
                    {email}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {phone_number}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {created_at}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <button
                    onClick={() => {
                      ScrollUp();
                      setUpdateManagerID(id);
                      setUpdateMode(true);
                      setValue("name", name);
                      setValue("email", email);
                      setValue("phone_number", phone_number);
                    }}
                    className="bg-green-700 text-white p-2 rounded hover:bg-green-500"
                  >
                    <DriveFileRenameOutlineIcon />
                  </button>
                  <button
                    onClick={() => deleteManager(id)}
                    className="bg-red-800 text-white p-2 m-1 rounded hover:bg-red-500"
                  >
                    <DeleteForeverIcon />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName={"flex justify-center mt-4 text-2xl"}
          activeClassName={"bg-blue-500 text-white hover:bg-blue-700"}
          previousLabel={"السابق"}
          nextLabel={"التالي"}
          previousClassName={
            "mx-1 px-4 py-1 border rounded-lg text-[20px] bg-gray-200 "
          }
          nextClassName={
            "mx-1 px-4 py-1 border rounded-lg text-[20px] bg-gray-200 "
          }
          pageClassName={"mx-1 px-3 py-1 border rounded-lg text-2xl font-bold "}
        />
      </div>
      {/* loader */}
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
export default AddSuperAdmin;
