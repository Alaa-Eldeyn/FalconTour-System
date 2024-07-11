import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchIcon from "@mui/icons-material/Search";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollUp } from "../ScrollUp";
import ReactPaginate from "react-paginate";

function Employees() {
  const baseUrl = import.meta.env.VITE_SOME_KEY;
  const [loader, setLoader] = useState(true);
  const [updateMode, setUpdateMode] = useState(false);
  const [updateEmpID, setUpdateEmpID] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const userToken = localStorage.getItem("user_token");
  const [employees, setEmployees] = useState([]);
  const [filteredEmp, setFilteredEmp] = useState([]);
  const [branches, setBranches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const Navigate = useNavigate();

  const handleUnauthenticated = () => {
    toast("يجب عليك تسجيل الدخول مرة ثانية لانتهاء الصلاحية", {
      type: "error",
      autoClose: 4000,
    });
    Navigate("/login");
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_role_name");
  };

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
      branch_id: z.string().min(1, "رقم الفرع مطلوب"),
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
    fetchEmployees();
    fetchBranchesInSelection();
    fetchPagination();
  }, []);

  const fetchPagination = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}employees?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setEmployees(response.data.data);
        setFilteredEmp(response.data.data);
        setTotalPages(response.data.meta.pagination.last_page);
      })
      .catch(function (error) {
        console.error("Error fetching branches:", error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  const fetchEmployees = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}employees`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setLoader(false);
        setEmployees(response.data.data);
        setFilteredEmp(response.data.data);
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

  const fetchBranchesInSelection = () => {
    axios
      .get(`${baseUrl}branches/select-name-id`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        setBranches(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching branches:", error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const storeEmployee = () => {
    setLoader(true);
    const employeeData = {
      name: getValues("name"),
      email: getValues("email"),
      password: getValues("password"),
      password_confirmation: getValues("password_confirmation"),
      phone_number: getValues("phone_number"),
      branch_id: getValues("branch_id"),
    };
    axios
      .post(`${baseUrl}employees`, employeeData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function () {
        toast.success("تم تسجيل الموظف بنجاح");
        fetchEmployees();
        reset();
        setValue("branch_id", "");
      })
      .catch(function (error) {
        if (
          error.response.data.message === "The email has already been taken."
        ) {
          toast.error("هذا البريد  الإلكتروني موجود بالفعل ");
        }
        console.error("Error fetching", error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const deleteEmp = (id) => {
    setLoader(true);
    axios
      .delete(`${baseUrl}employees/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function () {
        toast.success("تم حذف الموظف بنجاح");
        fetchEmployees();
      })
      .catch(function (error) {
        console.error("Error fetching", error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleEmpUpdate = () => {
    setLoader(true);
    axios
      .post(
        `${baseUrl}employees/${updateEmpID}`,
        {
          name: getValues("name"),
          email: getValues("email"),
          password: getValues("password"),
          password_confirmation: getValues("password_confirmation"),
          phone_number: getValues("phone_number"),
          branch_id: getValues("branch_id"),
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(function () {
        toast.success("تم تحديث البيانات بنجاح");
        reset();
        fetchEmployees();
        setUpdateMode(false);
      })
      .catch(function (error) {
        console.error("Error fetching", error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  //search
  useEffect(() => {
    if (searchValue === "") {
      setFilteredEmp(employees);
    } else {
      setFilteredEmp(
        employees.filter((item) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
  }, [searchValue, employees]);

  return (
    <div>
      <div className="flex items-center justify-center border-2 rounded-xl p-3 bg-gray-700">
        {/* register & update users */}
        <div className="mx-auto w-full ">
          <form className=" space-y-3">
            <div className=" flex flex-wrap gap-3">
              <div className="w-[49%] flex-grow">
                <input
                  type="text"
                  {...register("name")}
                  placeholder="اسم الموظف"
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
              <div className="w-[49%] flex-grow">
                <select
                  {...register("branch_id")}
                  className="select select-bordered flex-grow w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                >
                  <option value="" disabled selected>
                    اختر الفرع
                  </option>
                  {branches.map((branch) => {
                    const { id, name } = branch;
                    return <option key={id} value={id} label={name} />;
                  })}
                </select>
                {errors && (
                  <span className="text-red-500 text-sm">
                    {errors.branch_id?.message}
                  </span>
                )}
              </div>
            </div>

            <div>
              {updateMode ? (
                <button
                  onClick={handleSubmit(handleEmpUpdate)}
                  disabled={isSubmitting}
                  className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                >
                  تحديث الموظف
                </button>
              ) : (
                <button
                  onClick={handleSubmit(storeEmployee)}
                  disabled={isSubmitting}
                  className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                >
                  تسجيل موظف جديد
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Search input form */}
      <div className="my-3">
        <div className="w-full relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <SearchIcon className="text-white" />
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={`ابحث عن موظف بالاسم`}
            required
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      {/* Table to display branch data */}
      <table className="border-collapse w-full">
        <thead>
          <tr>
            {[
              "الترتيب",
              "الاسم",
              "البريد",
              "رقم الهاتف",
              "الفرع",
              "الدور",
              "تاريخ الانشاء",
              "التعديل",
            ].map((header, index) => (
              <th
                key={index}
                className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Mapping branches data to table rows */}
          {filteredEmp.map((emp, index) => {
            const {
              id,
              name,
              email,
              phone_number,
              branch,
              role_name,
              created_at,
            } = emp;
            const tableIndex = (currentPage - 1) * 15 + index + 1;

            return (
              <tr
                key={id}
                className="bg-white lg:hover:bg-gray-200 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0"
              >
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg</td>:static">
                  {tableIndex}
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-2 text-xs font-bold">
                    {name}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
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
                    {branch?.name}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  py-1 px-3 text-xs font-bold">
                    {role_name}
                  </span>
                </td>
                <td className="w-full lg:w-auto  text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <span className="rounded  px-1  text-xs font-bold">
                    {created_at}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  <button
                    onClick={() => {
                      ScrollUp();
                      setUpdateEmpID(id);
                      setUpdateMode(true);
                      setValue("name", name);
                      setValue("email", email);
                      setValue("phone_number", phone_number);
                      console.log(branch.id);
                      setValue(
                        "branch_id",
                        branches
                          .find((br) => br.id === branch.id)
                          ?.id.toString()
                      );
                    }}
                    className="bg-green-700 text-white p-2 rounded hover:bg-green-500"
                  >
                    <DriveFileRenameOutlineIcon />
                  </button>
                  <button
                    onClick={() => deleteEmp(id)}
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
        {/* Render pagination */}
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
            "mx-1 px-4 py-1 border rounded-lg text-[20px] hover:bg-gray-200"
          }
          nextClassName={
            "mx-1 px-4 py-1 border rounded-lg text-[20px] hover:bg-gray-200"
          }
          pageClassName={
            "mx-1 px-4 py-1 border rounded-lg text-[20px] hover:bg-gray-200"
          }
        />
      </div>
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

export default Employees;
