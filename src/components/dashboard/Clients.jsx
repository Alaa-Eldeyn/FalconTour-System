import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchIcon from "@mui/icons-material/Search";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { toast } from "react-toastify";
import { ScrollUp } from "../ScrollUp";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactPaginate from "react-paginate";

function Clients() {
  const baseUrl = import.meta.env.VITE_SOME_KEY;
  const [loader, setLoader] = useState(false);
  const [countries, setCountries] = useState([]);

  const userToken = localStorage.getItem("user_token");
  const userRoleName = localStorage.getItem("user_role_name");

  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const [updateClientID, setUpdateClientID] = useState("");
  const [singleClient, setSingleClient] = useState({});
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

  const schema = z.object({
    name: z.string().min(1, { message: "يجب ادخال اسم العميل" }),
    email: z.string().email({ message: "يجب ادخال بريد الكترونى صحيح" }),
    phone_number: z.string().min(1, { message: "يجب ادخال رقم الهاتف " }),
    address: z.string().min(1, { message: "يجب ادخال العنوان" }),
    countries_id: z.string().min(1, { message: "يجب ادخال رمز المدينة" }),
    image: z.any(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    fetchPagination();
  }, [currentPage]);
  const fetchPagination = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}clients?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setClients(response.data.data);
        setFilteredClients(response.data.data);
        setTotalPages(response.data.meta.pagination.last_page);
        setLoader(false);
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

  useEffect(() => {
    fetchClients();
    fetchCountries();
  }, []);

  const fetchCountries = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}countries`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setCountries(response.data.data);
      })
      .catch(function (error) {
        console.error("Error fetching countries:", error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const fetchClients = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}clients`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setClients(response.data.data);
        setFilteredClients(response.data.data);
      })
      .catch(function (error) {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const storeClient = () => {
    setLoader(true);
    const clientData = {
      name: getValues("name"),
      email: getValues("email"),
      phone_number: getValues("phone_number"),
      address: getValues("address"),
      branch_id: clients[0]?.branch?.branch_id,
      countries_id: getValues("countries_id"),
    };
    if (getValues("notes")) {
      clientData.notes = getValues("notes");
    }
    if (getValues("image").length > 0) {
      clientData.image = getValues("image")[0];
    }
    axios
      .post(`${baseUrl}clients`, clientData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "content-type": "multipart/form-data",
        },
      })
      .then(function () {
        toast.success("تم تسجيل العميل بنجاح");
        fetchClients();
        reset();
        setValue("countries_id", "");
      })
      .catch(function (error) {
        if (error.response.data.message === "Unauthenticated.") {
          handleUnauthenticated();
        }
        if (
          error.response.data.message === "The email has already been taken."
        ) {
          toast.error("هذا البريد الإلكتروني موجود بالفعل");
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const deleteClient = (id) => {
    setLoader(true);
    axios
      .delete(`${baseUrl}clients/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function () {
        fetchClients();
        toast.success(`تم حذف العميل بنجاح`);
      })
      .catch(function (error) {
        toast.error(error.response.data.message);
      });
  };

  const handleClientUpdate = () => {
    setLoader(true);
    const updateClientData = {
      name: getValues("name"),
      email: getValues("email"),
      phone_number: getValues("phone_number"),
      address: getValues("address"),
      branch_id: clients[0]?.branch?.branch_id,
      countries_id: getValues("countries_id"),
    };
    if (getValues("notes")) {
      updateClientData.notes = getValues("notes");
    }
    if (getValues("image").length > 0) {
      updateClientData.image = getValues("image")[0];
    }
    axios
      .post(`${baseUrl}clients/${updateClientID}`, updateClientData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "content-type": "multipart/form-data",
        },
      })
      .then(function () {
        toast.success("تم تحديث العميل بنجاح");
        setUpdateMode(false);
        fetchClients();
        reset();
        setValue("countries_id", "");
      })
      .catch(function (error) {
        if (
          error.response.data.message === "The email has already been taken."
        ) {
          toast.error("هذا البريد الإلكتروني موجود بالفعل");
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    if (searchValue === "") {
      setFilteredClients(clients);
    } else {
      setFilteredClients(
        clients.filter((item) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
  }, [searchValue, clients]);

  const fetchClientById = (id) => {
    let single = clients.filter((client) => client.id === id);
    setSingleClient(...single);
  };

  return (
    <div>
      <div className="w-full mb-5">
        <div className=" text-3xl font-bold text-gray-900 mb-5 underline underline-offset-8 decoration-blue-500">
          صفحة إدراة العملاء
        </div>
      </div>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box relative">
          <div className="modal-action absolute -top-4 left-2">
            <form method="dialog">
              <button className="btn rounded-full w-12 h-10 bg-red-500 text-white text-lg">
                X
              </button>
            </form>
          </div>
          <div className="text-center flex flex-col justify-center">
            {singleClient?.imagePath && singleClient?.image && (
              <div>
                <dt className="font-medium   mb-4 text-lg text-gray-500">
                  صورة العميل
                </dt>
                <img
                  src={`${baseUrl}${singleClient?.imagePath}/${singleClient?.image}`}
                  alt="avatar"
                  className="w-[140px] h-[140px] rounded-lg border-zinc-500 mx-auto mb-4"
                />
              </div>
            )}

            <div className="bg-white overflow-hidden shadow rounded-lg border">
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      البريد الإلكتروني :
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {singleClient?.email}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      اسم الفرع المسجل به العميل:
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {singleClient?.branch?.branch_name}
                    </dd>
                  </div>
                  {singleClient?.notes && (
                    <div className=" py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        الملاحظات:
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {singleClient?.notes}
                      </dd>
                    </div>
                  )}
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      العنوان:
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {singleClient?.address}
                    </dd>
                  </div>

                  <div className=" py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      الجنسية :
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {singleClient?.nationality?.nationality}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      وقت إنشاء الحساب :
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {singleClient?.created_at}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {userRoleName === "admin" ? (
        <div className="flex items-center justify-center border-2 rounded-xl p-3 bg-gray-700">
          {/* register & update users */}
          <div className="mx-auto w-full ">
            <form className=" space-y-3">
              <div className=" flex flex-wrap gap-3">
                <div className="w-[49%] flex-grow ">
                  <input
                    type="text"
                    {...register("name")}
                    placeholder="اسم العميل "
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
                <div className="w-[49%] flex-grow ">
                  <input
                    type="number"
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
                <div className="w-[49%] flex-grow ">
                  <input
                    type="text"
                    {...register("address")}
                    placeholder="العنوان"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                  {errors && (
                    <span className="text-red-500 text-sm">
                      {errors.address?.message}
                    </span>
                  )}
                </div>
              </div>
              <div className=" flex flex-wrap gap-3">
                <div className="w-[49%] flex-grow ">
                  <select
                    defaultValue=""
                    {...register("countries_id")}
                    className="select select-bordered flex-grow w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  >
                    <option value="" disabled>
                      الدولة
                    </option>
                    {countries.map((nat) => {
                      const { id, en_short_name } = nat;
                      return (
                        <option key={id} value={id} label={en_short_name} />
                      );
                    })}
                  </select>
                  {errors && (
                    <span className="text-red-500 text-sm">
                      {errors.countries_id?.message}
                    </span>
                  )}
                </div>
                <div className="w-[49%] flex-grow ">
                  <div className="flex items-center justify-center w-full">
                    <input
                      {...register("image")}
                      accept="image/*"
                      className="file-input file-input-bordered w-full"
                      id="file_input"
                      type="file"
                    />
                  </div>
                </div>
              </div>
              <div className="flex-grow ">
                <textarea
                  {...register("notes")}
                  rows={2}
                  placeholder="ملاحظات"
                  className="w-full overflow-auto rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>

              <div>
                {updateMode ? (
                  <button
                    onClick={handleSubmit(handleClientUpdate)}
                    disabled={isSubmitting}
                    className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                  >
                    تحديث العميل
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit(storeClient)}
                    disabled={isSubmitting}
                    className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                  >
                    تسجيل عميل جديد
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : (
        ""
      )}

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
            placeholder={`ابحث عن عميل بالاسم`}
            required
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      {/* Table to display branch clients */}
      <table className="border-collapse w-full">
        <thead>
          {userRoleName === "admin" ? (
            <tr>
              {["الترتيب", "الاسم", "رقم الموبايل", "تعديل البيانات"].map(
                (header, index) => (
                  <th
                    key={index}
                    className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          ) : (
            <tr>
              {["الترتيب", "الاسم", "رقم الموبايل"].map((header, index) => (
                <th
                  key={index}
                  className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell"
                >
                  {header}
                </th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {filteredClients.map((client, index) => {
            const {
              id,
              name,
              address,
              email,
              phone_number,
              nationality,
              branch,
              notes,
            } = client;
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
                    {phone_number}
                  </span>
                </td>

                {userRoleName === "admin" ? (
                  <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                    <div className="flex gap-2 justify-center items-center">
                      <button
                        onClick={() => {
                          ScrollUp();
                          setUpdateClientID(id);
                          setUpdateMode(true);
                          setValue("name", name);
                          setValue("address", address);
                          setValue("email", email);
                          setValue("phone_number", phone_number.toString());
                          setValue("branch_id", branch.branch_name.toString());
                          setValue("countries_id", nationality.id.toString());
                          setValue("notes", notes);
                        }}
                        className="bg-green-700 text-white p-2 rounded hover:bg-green-500"
                      >
                        <DriveFileRenameOutlineIcon />
                      </button>
                      <button
                        onClick={() => deleteClient(id)}
                        className="bg-red-800 text-white p-2 m-1 rounded hover:bg-red-500"
                      >
                        <DeleteForeverIcon />
                      </button>
                      <button
                        onClick={() => {
                          document.getElementById("my_modal_2").showModal();
                          fetchClientById(id);
                        }}
                        className="bg-sky-700 text-white p-2 rounded hover:bg-sky-500"
                      >
                        <VisibilityIcon />
                      </button>
                    </div>
                  </td>
                ) : (
                  ""
                )}
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
            "mx-1 px-4 py-1 border rounded-lg text-[20px] bg-gray-200 "
          }
          nextClassName={
            "mx-1 px-4 py-1 border rounded-lg text-[20px] bg-gray-200 "
          }
          pageClassName={"mx-1 px-3 py-1 border rounded-lg text-2xl font-bold "}
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

export default Clients;
