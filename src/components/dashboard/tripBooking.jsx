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
import { ScrollUp } from "../ScrollUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReactPaginate from "react-paginate";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

const TripBooking = () => {
  const baseUrl = import.meta.env.VITE_SOME_KEY;

  const [loader, setLoader] = useState(true);
  const Navigate = useNavigate();
  const userToken = localStorage.getItem("user_token");
  const userRoleName = localStorage.getItem("user_role_name");
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [updateMode, setUpdateMode] = useState(false);
  const [updateTripsID, setUpdateTripsID] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [showTripName, setShowTripName] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bookingTrip, setBookingTrip] = useState([]);
  const [clients, setClients] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showCurrencies, setShowCurrencies] = useState([]);

  const schema = z.object({
    client_id: z.string().min(1, { message: "اختر اسم العميل" }),
    cost: z.string().min(1, { message: "يجب تعيين تكلفة الرحلة" }),
    currency_id: z.string().min(1, { message: "اختر العملة" }),
    payment_id: z.string().min(1, { message: "اختر طريقة الدفع" }),
    number_of_tickets: z.string().min(1, { message: "ادخل عدد التذاكر" }),
    type: z.string().min(1, { message: "يجب تعيين نوع الرحلة" }),
    trip_id: z.string().min(1, { message: "اختر اسم الرحلة " }),
    ticket_number: z.string().optional(),
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
    fetchClients();
    fetchPayments();
    fetchCurrencies();
    fetchTrip();
    fetchData();
  }, []);

  const fetchSingleBookingTrip = (id) => {
    let single = bookings.filter((bt) => bt.id === id);
    setBookingTrip(...single);
  };

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
        setBookings(response.data.data);
        setFilteredBookings(response.data.data);
        setTotalPages(response.data.meta.pagination.last_page);
      })
      .catch(function () {
        return null;
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  function fetchTrip() {
    setLoader(true);
    axios
      .get(`${baseUrl}trips/selection/id-name`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setShowTripName(response.data.data);
      })
      .catch(function () {
        return null;
      })
      .finally(() => {
        setLoader(false);
      });
  }

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
      .catch(function () {
        return null;
      })
      .finally(() => {
        setLoader(false);
      });
  };

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
        console.log(error);
      })
      .finally(() => {
        setLoader(false);
      });
  }

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
      .catch(function () {
        return null;
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
        setBookings(response.data.data);
        setFilteredBookings(response.data.data);
      })
      .catch(function (error) {
        if (error.response && error.response.status === 401) {
          handleUnauthenticated();
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const storeTrips = async () => {
    setLoader(true);
    let tripData = {
      client_id: getValues("client_id"),
      cost: getValues("cost"),
      currency_id: getValues("currency_id"),
      payment_id: getValues("payment_id"),
      number_of_tickets: getValues("number_of_tickets"),
      type: getValues("type"),
      trip_id: getValues("trip_id"),
    };

    if (!getValues("ticket_number") && getValues("image").length > 0) {
      tripData.image = getValues("image[0]");
    } else if (getValues("image").length == 0 && getValues("ticket_number")) {
      tripData.ticket_number = getValues("ticket_number");
    } else if (getValues("ticket_number") && getValues("image").length > 0) {
      tripData.image = getValues("image[0]");
      tripData.ticket_number = getValues("ticket_number");
    }

    await axios
      .post(`${baseUrl}bookings/trip`, tripData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        toast("تم حجز الرحلة  بنجاح", { type: "success" });
        fetchData();
        reset();
        setValue("type", "");
        setValue("tripTo", "");
        setValue("trip_id", "");
        setValue("client_id", "");
        setValue("currency_id", "");
        setValue("payment_id", "");
      })
      .catch(() => {
        return null;
      })
      .finally(() => {
        setLoader(false);
      });
  };

  function deleteTrips(id) {
    setLoader(true);
    axios
      .delete(`${baseUrl}bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function () {
        toast.success("تم حذف الرحلة بنجاح");
        fetchData();
      })
      .catch(function (error) {
        console.error("Error deleting branch:", error);
        setLoader(true);
      })
      .finally(() => {
        setLoader(false);
      });
  }

  const updateTrips = async () => {
    setLoader(true);
    let tripData = {
      client_id: getValues("client_id"),
      cost: getValues("cost"),
      currency_id: getValues("currency_id"),
      payment_id: getValues("payment_id"),
      number_of_tickets: getValues("number_of_tickets"),
      type: getValues("type"),
      trip_id: getValues("trip_id"),
    };

    if (!getValues("ticket_number") && getValues("image").length > 0) {
      tripData.image = getValues("image[0]");
    } else if (getValues("image").length == 0 && getValues("ticket_number")) {
      tripData.ticket_number = getValues("ticket_number");
    } else if (getValues("ticket_number") && getValues("image").length > 0) {
      tripData.image = getValues("image[0]");
      tripData.ticket_number = getValues("ticket_number");
    }

    await axios
      .post(`${baseUrl}bookings/trip/${updateTripsID}`, tripData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        toast("تم تحديث الرحلة  بنجاح", { type: "success" });
        fetchData();
        setUpdateMode(false);
        setValue("type", "");
        setValue("tripTo", "");
        setValue("trip_id", "");
        setValue("client_id", "");
        setValue("currency_id", "");
        setValue("payment_id", "");
        reset();
      })
      .catch((error) => {
        if (error.response.data.message === "Already_exist") {
          toast("هذة الرحلة موجودة بالعفل ", { type: "error" });
        }
        if (
          error.response.data.message === "The name has already been taken."
        ) {
          toast("هذة الرحلة مسجل بالعفل ", { type: "error" });
        }
        if (
          error.response.data.message === "You Not allow to update Booking Now"
        ) {
          toast("غير مسموع بتعديل هذة الرحلة الأن  ", { type: "error" });
          setUpdateMode(false);
          reset();
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    if (searchValue === "") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(
        bookings.filter((item) =>
          item?.client?.name?.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
  }, [searchValue, bookings]);

  return (
    <div className="flex flex-col">
      <div className="w-full mb-5">
        <Link
          className="bg-gray-500 text-white  float-left p-2 rounded-lg hover:bg-gray-700 hover:shadow-lg transition duration-200"
          to="/dashboard/booking/service"
        >
          انتقل إلى حجز خدمة أخري
          <KeyboardDoubleArrowLeftIcon />
        </Link>
        <div className=" text-3xl font-bold text-gray-900 -mb-5 underline underline-offset-8 decoration-blue-500">
          صفحة حجز الرحلات
        </div>
      </div>
      <main className="branchTable">
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box max-w-4xl relative">
            <div className="modal-action absolute -top-4 left-2">
              <form method="dialog">
                <button className="btn rounded-full w-12 h-10 bg-red-600 text-white">
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
                        {bookingTrip?.employee?.name}
                      </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        رقم هاتف الموظف :
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bookingTrip?.employee?.phone_number}
                      </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6  ">
                      <dt className="text-sm font-medium text-gray-500">
                        اسم العميل:
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bookingTrip?.client?.name}
                      </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        رقم هاتف العميل :
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bookingTrip?.client?.phone_number}
                      </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        عنوان العميل :
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bookingTrip?.client?.address}
                      </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        ايميل العميل :
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bookingTrip?.client?.email}
                      </dd>
                    </div>

                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        عنوان العميل :
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bookingTrip?.client?.address}
                      </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        الفرع المسجل به العميل :
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bookingTrip?.client?.branch?.branch_name}
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
                        بيانات الرحلة
                      </dt>
                    </div>

                    {bookingTrip?.documentPath && bookingTrip?.document && (
                      <div className="">
                        <div className="w-full">
                          <img
                            src={`${baseUrl}${bookingTrip?.documentPath}/${bookingTrip?.document}`}
                            alt="avatar"
                            className="w-[200px] h-[200px]  rounded-lg border-2 p-1 border-zinc-500 mx-auto mt-5 mb-4"
                          />
                          <dt className="text-sm font-medium text-gray-500">
                            صورة الخدمة
                          </dt>
                        </div>
                      </div>
                    )}
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        اسم الرحلة :
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bookingTrip?.bookingTrip?.trip?.name}
                      </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        وقت الاقلاع :
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bookingTrip?.bookingTrip?.trip?.takeOff}
                      </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        التكلفة :
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bookingTrip?.bookingTrip?.trip?.cost}
                      </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        من :
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bookingTrip?.bookingTrip?.trip?.from?.en_short_name}
                      </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        إلى :
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bookingTrip?.bookingTrip?.trip?.to?.en_short_name}
                      </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        رقم التذكرة:
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bookingTrip?.bookingTrip?.ticket_number || "لا يوجد"}
                      </dd>
                    </div>
                    <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        وقت انشاء الرحلة :
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {bookingTrip?.bookingTrip?.trip?.created_at}
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
            <div className="mx-auto w-full ">
              <form className=" space-y-3">
                <div className="flex gap-4	">
                  <div className="flex-grow w-full">
                    <select
                      {...register("client_id")}
                      defaultValue=""
                      className=" border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2  dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                      placeholder="تكلفة الرحلة "
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-md font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    />
                    {errors && (
                      <span className="text-red-500 text-sm">
                        {errors.cost?.message}
                      </span>
                    )}
                  </div>
                  <div className="flex-grow w-full">
                    <input
                      type="number"
                      {...register("number_of_tickets")}
                      placeholder="عدد التذاكر "
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-md font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    />
                    {errors && (
                      <span className="text-red-500 text-sm">
                        {errors.number_of_tickets?.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className=" flex flex-wrap gap-3">
                  <div className="w-[49%] flex-grow ">
                    <input
                      type="text"
                      {...register("ticket_number")}
                      placeholder="رقم التذكرة"
                      dir="rtl"
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    />
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
                <div className="flex gap-4	">
                  <div className="flex-grow w-full">
                    <select
                      defaultValue=""
                      {...register("payment_id")}
                      className=" border border-gray-300 text-gray-900  text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5   dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                      defaultValue=""
                      {...register("currency_id")}
                      className=" border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5   dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <select
                      id="countries"
                      defaultValue=""
                      {...register("type")}
                      className=" border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2   dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="" disabled>
                        نوع الرحلة
                      </option>
                      <option value="1">ذهاب</option>
                      <option value="2">ذهاب وعودة</option>
                    </select>
                    {errors && (
                      <span className="text-red-500 text-sm">
                        {errors.type?.message}
                      </span>
                    )}
                  </div>
                  <div className="w-1/2">
                    <select
                      defaultValue=""
                      id="countries"
                      {...register("trip_id")}
                      className=" border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2   dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="" disabled>
                        اسم الرحلة
                      </option>
                      {showTripName.map((tripName, index) => {
                        return (
                          <option key={index} value={tripName.id}>
                            {tripName.name}
                          </option>
                        );
                      })}
                    </select>
                    {errors && (
                      <span className="text-red-500 text-sm">
                        {errors.trip_id?.message}
                      </span>
                    )}
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
                      تحديث الرحلة
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      onClick={handleSubmit(storeTrips)}
                      className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                    >
                      حجز الرحلة
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
          <form className="w-full relative">
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
          </form>
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
                  تكلفة الرحلة
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  نوع العملة
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  طريقة الدفع
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  اسم الرحلة
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  عدد التذاكر
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  نوع الرحلة
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
                  تكلفة الرحلة
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  نوع العملة
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  طريقة الدفع
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  اسم الرحلة
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  عدد التذاكر
                </th>
                <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                  نوع الرحلة
                </th>
              </tr>
            </thead>
          )}
          <tbody>
            {filteredBookings.map((booking, index) => {
              const {
                id,
                client,
                currency,
                payment,
                bookingTrip,
                bookingService,
              } = booking;
              const tableIndex = (currentPage - 1) * 15 + index + 1;
              if (bookingService !== null) return;
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
                      {bookingTrip?.trip?.cost}
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
                      {bookingTrip?.trip?.name}
                    </span>
                  </td>
                  <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                    <span className="rounded  px-1 text-xs font-bold">
                      {bookingTrip?.number_of_ticket}
                    </span>
                  </td>
                  <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                    <span className="rounded  px-1 text-xs font-bold">
                      {bookingTrip?.type}
                    </span>
                  </td>
                  {userRoleName === "admin" ? (
                    <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                      <div className="flex gap-2 justify-center items-center">
                        <button
                          onClick={() => {
                            ScrollUp();
                            setUpdateTripsID(id);
                            setUpdateMode(true);
                            setValue("client_id", client?.id.toString());
                            setValue(
                              "cost",
                              bookingTrip?.trip?.cost.toString()
                            );
                            setValue("currency_id", currency?.id.toString());
                            setValue("payment_id", payment?.id.toString());
                            setValue(
                              "number_of_tickets",
                              bookingTrip?.number_of_ticket.toString()
                            );
                            setValue(
                              "ticket_number",
                              bookingTrip?.ticket_number
                            );
                            setValue(
                              "trip_id",
                              bookingTrip?.trip?.id.toString()
                            );
                            setValue(
                              "type",
                              (bookingTrip?.type === "ذهاب" ? 1 : 2).toString()
                            );
                          }}
                          className="bg-green-700 text-white p-2 rounded hover:bg-green-500"
                        >
                          <DriveFileRenameOutlineIcon />
                        </button>
                        <button
                          onClick={() => deleteTrips(id)}
                          className="bg-red-800 text-white p-2 m-1 rounded hover:bg-red-500"
                        >
                          <DeleteForeverIcon />
                        </button>
                        <button
                          onClick={() => {
                            document.getElementById("my_modal_2").showModal();
                            fetchSingleBookingTrip(id);
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
              "mx-1 px-4 py-1 border rounded-lg text-[20px] hover:bg-gray-200"
            }
            nextClassName={
              "mx-1 px-4 py-1 border rounded-lg text-[20px] bg-gray-200 "
            }
            pageClassName={
              "mx-1 px-3 py-1 border rounded-lg text-2xl font-bold "
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
      </main>
    </div>
  );
};

export default TripBooking;
