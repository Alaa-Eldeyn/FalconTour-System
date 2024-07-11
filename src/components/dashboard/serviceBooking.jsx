import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchIcon from "@mui/icons-material/Search";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReactPaginate from "react-paginate";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import {ScrollUp} from "../ScrollUp"

const ServiceBooking = () => {
  const baseUrl = import.meta.env.VITE_SOME_KEY;

  const [loader, setLoader] = useState(true);
  const Navigate = useNavigate();
  const userToken = localStorage.getItem("user_token");
  const userRoleName = localStorage.getItem("user_role_name");
  const [updateMode, setUpdateMode] = useState(false);
  const [updateSrvID, setUpdateSrvID] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [showSrvName, setShowSrvName] = useState([]);
  const [bookingService, setBookingService] = useState([]);
  const [clients, setClients] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showCurrencies, setShowCurrencies] = useState([]);

  const schema = z.object({
    client_id: z.string().min(1, { message: "اختر اسم العميل" }),
    cost: z.string().min(1, { message: "يجب تعيين تكلفة الخدمة" }),
    currency_id: z.string().min(1, { message: "اختر العملة" }),
    payment_id: z.string().min(1, { message: "اختر طريقة الدفع" }),
    service_id: z.string().min(1, { message: "ادخل نوع الخدمة" }),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
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
    fetchData();
    fetchPayments();
    serviceName();
    fetchCurrencies();
    fetchClients();
  }, []);

  const fetchSingleBookingService = (id) => {
    let single = services.filter((bt) => bt.id === id);
    setBookingService(...single);
  };

  //pagenation
  useEffect(() => {
    fetchPagination();
  }, [currentPage]);
  const fetchPagination = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}bookings?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setServices(response.data.data);
        setFilteredServices(response.data.data);
        setTotalPages(response.data.meta.pagination.last_page);
      })
      .catch(function (error) {
        if (
          error.response.data.message === "User does not have the right roles."
        ) {
          return null;
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  // fetch service_id
  function serviceName() {
    setLoader(true);
    axios
      .get(`${baseUrl}services/selection/id-name`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setShowSrvName(response.data.data);
      })
      .catch(function (error) {
        if (
          error.response.data.message === "User does not have the right roles."
        ) {
          return null;
        }
      })
      .finally(() => {
        setLoader(false);
      });
  }

  // fetch payments method
  const fetchPayments = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}payments`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setPayments(response.data.data);
      })
      .catch(function (error) {
        if (
          error.response.data.message === "User does not have the right roles."
        ) {
          return null;
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };

  // fetch currencies
  function fetchCurrencies() {
    setLoader(true);
    axios
      .get(`${baseUrl}currencies/selection/id-name`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setShowCurrencies(response.data.data);
      })
      .catch(function (error) {
        if (
          error.response.data.message === "User does not have the right roles."
        ) {
          return null;
        }
      })
      .finally(() => {
        setLoader(false);
      });
  }
  // fetch clients
  const fetchClients = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}clients/selection/id-name`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setClients(response.data.data);
      })
      .catch(function (error) {
        if (
          error.response.data.message === "User does not have the right roles."
        ) {
          return null;
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const fetchData = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}bookings`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setServices(response.data.data);
        setFilteredServices(response.data.data);
      })
      .catch(function (error) {
        if (error.response && error.response.status === 401) {
          handleUnauthenticated();
        }
        if (
          error.response.data.message === "User does not have the right roles."
        ) {
          return null;
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const storeSrv = async () => {
    setLoader(true);
    let data = {
      client_id: getValues("client_id"),
      cost: getValues("cost"),
      currency_id: getValues("currency_id"),
      payment_id: getValues("payment_id"),
      service_id: getValues("service_id"),
    };

    if (getValues("image").length > 0) {
      data.image = getValues("image[0]");
    }
    await axios
      .post(`${baseUrl}bookings/service`, data, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        toast("تم حجز الخدمة بنجاح", { type: "success" });
        fetchData();
        reset();
        setValue("client_id", "");
        setValue("cost", "");
        setValue("currency_id", "");
        setValue("payment_id", "");
        setValue("service_id", "");
      })
      .catch((error) => {
        if (
          error.response.data.message === "The name has already been taken."
        ) {
          toast.error("الخدمة موجودة بالفعل");
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };
  function deleteSrv(id) {
    setLoader(true);
    axios
      .delete(`${baseUrl}bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function () {
        toast.success("تم حذف الخدمة بنجاح");
        fetchData();
      })
      .catch(function () {
        setLoader(true);
      })
      .finally(() => {
        setLoader(false);
      });
  }
  // update bookservice
  const updateTrips = async () => {
    setLoader(true);
    let data = {
      client_id: getValues("client_id"),
      cost: getValues("cost"),
      currency_id: getValues("currency_id"),
      payment_id: getValues("payment_id"),
      service_id: getValues("service_id"),
    };

    if (getValues("image").length > 0) {
      data.image = getValues("image[0]");
    }

    await axios
      .post(`${baseUrl}bookings/service/${updateSrvID}`, data, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        toast("تم تحديث الخدمة  بنجاح", { type: "success" });
        fetchData();
      })
      .catch((response) => {
        if (response.response.data.message == "Already_exist") {
          toast("هذة الخدمة موجودة بالعفل ", { type: "error" });
        }
        return null;
      })
      .finally(() => {
        setLoader(false);
        setUpdateMode(false);
        reset();
        setValue("type", "");
        setValue("tripTo", "");
        setValue("service_id", "");
        setValue("client_id", "");
        setValue("currency_id", "");
        setValue("payment_id", "");
      });
  };

  //search
  useEffect(() => {
    if (searchValue === "") {
      setFilteredServices(services);
    } else {
      setFilteredServices(
        services.filter((item) =>
          item?.client?.name?.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
  }, [searchValue, services]);

  return (
    <div className="flex flex-col">
      <div className="w-full mb-5">
        <Link
          className="bg-gray-500 text-white  float-left p-2 rounded-lg hover:bg-gray-700 hover:shadow-lg transition duration-200"
          to="/dashboard/booking/trip"
        >
          انتقل إلى حجز رحلة
          <KeyboardDoubleArrowLeftIcon />
        </Link>
        <div className=" text-3xl font-bold text-gray-900 -mb-5 underline underline-offset-8 decoration-blue-500">
          {/* <ManageAccountsIcon sx={{ fontSize: 30 }} className="text-blue-500"/> */}
          صفحة حجز الخدمات
        </div>
      </div>
      {/* start dialog */}
      <main className="branchTable">
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box max-w-4xl relative">
            <div className="modal-action absolute -top-4 left-2">
              <form method="dialog">
                <button className="btn rounded-full w-12 h-10 text-white bg-red-500">
                  X
                </button>
              </form>
            </div>
            <div className="text-center flex justify-center">
              <div className="bg-white overflow-hidden shadow rounded-lg border">
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-1 sm:py-5 mx-0 sm:gap-4 sm:px-6 bg-gray-200 font-bold ">
                      <dt className="text-lg font-medium text-gray-500">
                        بيانات الموظف والعميل
                      </dt>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        اسم الموظف :
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bookingService?.employee?.name}
                      </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        رقم هاتف الموظف :
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bookingService?.employee?.phone_number}
                      </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        اسم العميل:
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bookingService?.client?.name}
                      </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        رقم هاتف العميل :
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bookingService?.client?.phone_number}
                      </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        الفرع :
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bookingService?.client?.branch?.branch_name}
                      </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        الإيميل الخاص بالعميل :
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bookingService?.client?.email}
                      </dd>
                    </div>

                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        عنوان العميل :
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bookingService?.client?.address}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg border">
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-1 sm:py-5 mx-0 sm:gap-4 sm:px-6 bg-gray-200 font-bold ">
                      <dt className="text-lg font-medium text-gray-500">
                        بيانات الخدمة
                      </dt>
                    </div>
                    {bookingService?.documentPath &&
                      bookingService?.document && (
                        <div className="">
                          <div className="w-full">
                            <img
                              src={`${baseUrl}${bookingService?.documentPath}/${bookingService?.document}`}
                              alt="avatar"
                              className="w-[150px] h-[150px]  border-4 border-zinc-500 mx-auto mt-5 mb-4"
                            />
                            <dt className="text-sm font-medium text-gray-500">
                              صورة الخدمة
                            </dt>
                          </div>
                        </div>
                      )}
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        اسم الخدمة :
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bookingService?.bookingService?.service?.name}
                      </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        التكلفة :
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bookingService?.cost}
                      </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        وقت انشاء الخدمة :
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bookingService?.bookingService?.service?.created_at}
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
        {/* end dialog */}
        {userRoleName === "admin" ? (
          <div className="flex items-center justify-center border-2 rounded-xl p-3 bg-gray-700">
            <div className="mx-auto w-full ">
              <form className=" space-y-3">
                <div className="flex gap-4	">
                  <div className="flex-grow w-full">
                    <select
                      {...register("client_id")}
                      defaultValue=""
                      className=" border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2   dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="" disabled>
                        اختر العميل
                      </option>
                      {clients.map((client, index) => {
                        return (
                          <option key={index} value={client.id}>
                            {client.name}
                          </option>
                        );
                      })}
                    </select>
                    {errors && (
                      <span className="text-red-500 text-sm">
                        {errors.client_id?.message}
                      </span>
                    )}
                  </div>
                  <div className="flex-grow w-full">
                    <input
                      type="number"
                      {...register("cost")}
                      placeholder="تكلفة الخدمة "
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-md font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    />
                    {errors && (
                      <span className="text-red-500 text-sm">
                        {errors.cost?.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-4	">
                  <div className="flex-grow w-full">
                    <select
                      {...register("payment_id")}
                      defaultValue=""
                      className=" border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2   dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="" disabled>
                        اختر طريقة الدفع
                      </option>
                      {payments.map((payment, index) => {
                        return (
                          <option key={index} value={payment.id}>
                            {payment.name}
                          </option>
                        );
                      })}
                    </select>
                    {errors && (
                      <span className="text-red-500 text-sm">
                        {errors.payment_id?.message}
                      </span>
                    )}
                  </div>
                  <div className="flex-grow w-full">
                    <select
                      {...register("currency_id")}
                      defaultValue=""
                      className=" border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2   dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="" disabled>
                        اختر العملة
                      </option>
                      {showCurrencies.map((currency, index) => {
                        return (
                          <option key={index} value={currency.id}>
                            {currency.name}
                          </option>
                        );
                      })}
                    </select>
                    {errors && (
                      <span className="text-red-500 text-sm">
                        {errors.currency_id?.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="w-[49%] flex-grow ">
                    <select
                      id="countries"
                      {...register("service_id")}
                      defaultValue=""
                      className=" border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2   dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="" disabled>
                        اسم الخدمة
                      </option>
                      {showSrvName.map((serviceName, index) => {
                        return (
                          <option key={index} value={serviceName.id}>
                            {serviceName.name}
                          </option>
                        );
                      })}
                    </select>
                    {errors && (
                      <span className="text-red-500 text-sm">
                        {errors.service_id?.message}
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
                <div>
                  {updateMode ? (
                    <button
                      type="submit"
                      onClick={handleSubmit(updateTrips)}
                      disabled={isSubmitting}
                      className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                    >
                      تحديث الخدمة
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      onClick={handleSubmit(storeSrv)}
                      className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                    >
                      حجز الخدمة
                    </button>
                  )}
                </div>
              </form>
            </div>
            <div className="divider"></div>
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
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              className="block w-full p-4 pb-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="بحث باسم العميل"
              required
            />
          </div>
        </div>

        {/* Table to display branch data */}
        <table className="border-collapse w-full">
          {userRoleName === "admin" ? (
            <thead>
              <tr>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  الترتيب
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  اسم العميل
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  تكلفة الخدمة
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  نوع العملة
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  طريقة الدفع
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  اسم الخدمة
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  التعديل
                </th>
              </tr>
            </thead>
          ) : (
            <thead>
              <tr>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  الترتيب
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  اسم العميل
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  تكلفة الخدمة
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  نوع العملة
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  طريقة الدفع
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  اسم الخدمة
                </th>
              </tr>
            </thead>
          )}
          <tbody>
            {filteredServices.map((booking, index) => {
              const {
                id,
                client,
                currency,
                payment,
                bookingTrip,
                bookingService,
                cost,
              } = booking;
              const tableIndex = (currentPage - 1) * 15 + index + 1;
              if (bookingTrip !== null) return;
              return (
                <tr
                  key={id}
                  className="bg-white lg:hover:bg-gray-200 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0"
                >
                  <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                    {tableIndex}
                  </td>
                  <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                    <span className="rounded  px-1 text-xs font-bold">
                      {client?.name}
                    </span>
                  </td>
                  <td className="w-full lg:w-auto  text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                    <span className="rounded  px-1  text-xs font-bold">
                      {cost}
                    </span>
                  </td>
                  <td className="w-full lg:w-auto  text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                    <span className="rounded  px-1  text-xs font-bold">
                      {currency?.name}
                    </span>
                  </td>
                  <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                    <span className="rounded  px-1 text-xs font-bold">
                      {payment?.name}
                    </span>
                  </td>
                  <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                    <span className="rounded  px-1 text-xs font-bold">
                      {bookingService?.service?.name}
                    </span>
                  </td>
                  {userRoleName === "admin" ? (
                    <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                      <div className="flex gap-2 justify-center items-center">
                        <button
                          onClick={() => {
                            ScrollUp();
                            setUpdateSrvID(id);
                            setUpdateMode(true);
                            setValue("client_id", client?.id.toString());
                            setValue("cost", cost.toString());
                            setValue("currency_id", currency?.id.toString());
                            setValue("payment_id", payment?.id.toString());
                            setValue(
                              "service_id",
                              bookingService?.service?.id.toString()
                            );
                          }}
                          className="bg-green-700 text-white p-2 rounded hover:bg-green-500"
                        >
                          <DriveFileRenameOutlineIcon />
                        </button>
                        <button
                          onClick={() => deleteSrv(id)}
                          className="bg-red-800 text-white p-2 m-1 rounded hover:bg-red-500"
                        >
                          <DeleteForeverIcon />
                        </button>
                        <button
                          onClick={() => {
                            document.getElementById("my_modal_2").showModal();
                            fetchSingleBookingService(id);
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
            pageClassName={
              "mx-1 px-3 py-1 border rounded-lg text-2xl font-bold "
            }
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
      </main>
    </div>
  );
};

export default ServiceBooking;
