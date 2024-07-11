import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchIcon from "@mui/icons-material/Search";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@mui/material";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { ScrollUp } from "../ScrollUp";
import Select from "react-select";

function Airports() {
  const baseUrl = import.meta.env.VITE_SOME_KEY;

  const [airports, setAirports] = useState([]);
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [loader, setLoader] = useState(true);
  const Navigate = useNavigate();
  const userToken = localStorage.getItem("user_token");
  const [airportStatus, setAirportStatus] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [updateAirportID, setUpdateAirportID] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const schema = z.object({
    airportName: z.string().min(1, { message: "ادخل اسم المطار" }),
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
    fetchAirports();
    fetchAirlinesInSelection();
  }, []);

  const handleUnauthenticated = () => {
    toast("يجب عليك تسجيل الدخول مرة ثانية لانتهاء الصلاحية", {
      type: "error",
      autoClose: 2000,
    });
    Navigate("/login");
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_role_name");
  };

  const fetchAirports = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}airports`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setAirports(response.data.data);
        setFilteredAirports(response.data.data);
      })
      .catch(function (error) {
        if (error.response.data.message === "Unauthenticated.") {
          handleUnauthenticated();
          return;
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const storeAirport = async () => {
    setLoader(true);
    if (selectedOptions.length === 0) {
      toast.error("يجب اختيار خطوط الطيران", { type: "error" });
      setLoader(false);
      return;
    }
    await axios
      .post(
        `${baseUrl}airports`,
        {
          name: getValues("airportName"),
          airLines: selectedIds,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(() => {
        toast.success("تم إنشاء المطار  بنجاح");
        reset();
        setSelectedOptions([]);
        fetchAirports();
      })
      .catch((error) => {
        if (error.response.data.message == "Already_exist") {
          toast("هذا المطار موجود بالفعل ", { type: "error" });
        }
        if (
          error.response.data.message === "The name has already been taken."
        ) {
          toast.error("المطار مسجل بالفعل");
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };

  function deleteAirport(id) {
    setLoader(true);
    axios
      .delete(`${baseUrl}airports/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function () {
        toast.success("تم حذف المطار بنجاح");
        fetchAirports();
      })
      .catch(function () {
        return null;
      })
      .finally(() => {
        setLoader(false);
      });
  }

  const updateAirport = () => {
    setLoader(true);
    if (selectedOptions.length === 0) {
      toast.error("يجب اختيار خطوط الطيران", { type: "error" });
      setLoader(false);
      return;
    }
    axios
      .post(
        `${baseUrl}airports/${updateAirportID}`,
        {
          name: getValues("airportName"),
          airLines: selectedIds,
          status: airportStatus ? "1" : "0",
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(() => {
        toast("تم تحديث المطار  بنجاح", { type: "success" });
        fetchAirports();
        reset();
        setSelectedOptions([]);
        setUpdateMode(false);
      })
      .catch((error) => {
        if (error.response.data.message == "The name has already been taken.") {
          toast("هذا المطار مسجل بالعفل ", { type: "error" });
        }
        if (error.response.data.message === "Already_exist") {
          toast("هذا المطار موجودة بالعفل ", { type: "error" });
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    if (searchValue === "") {
      setFilteredAirports(airports);
    } else {
      setFilteredAirports(
        airports.filter((item) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
  }, [searchValue, airports]);

  const fetchAirlinesInSelection = () => {
    axios
      .get(`${baseUrl}airlines/selection/id-name`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        const options2 = response.data.data.map((airline) => ({
          value: airline.id,
          label: airline.name,
        }));
        setOptions(options2);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    fetchPagination();
  }, [currentPage]);

  const fetchPagination = () => {
    setLoader(true);
    axios
      .get(`${baseUrl}airports?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setAirports(response.data.data);
        setFilteredAirports(response.data.data);
        setTotalPages(response.data.meta.pagination.last_page);
        setLoader(false);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };
  const handleSelect = (selected) => {
    setSelectedOptions(selected);
    const selectedIds = selected.map((item) => item.value);
    setSelectedIds(selectedIds);
  };
  const defValues = [];
  const showAirPortById = (id) => {
    axios
      .get(`${baseUrl}airports/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        response.data.data.airLines.map((airline) => {
          defValues.push({ value: airline.id, label: airline.name });
          setSelectedOptions(defValues);
          setSelectedIds(defValues.map((item) => item.value));
        });
      });
  };

  return (
    <main className="branchTable">
      <div className=" text-3xl font-bold text-gray-900 mb-5 underline underline-offset-8 decoration-blue-500">
        صفحة إدراة المطارات
      </div>
      {/* add airport form */}
      <div className="flex items-center justify-center border-2 rounded-xl p-3 bg-gray-700">
        <div className="mx-auto w-full ">
          <form>
            <div className="mb-5">
              <input
                type="text"
                {...register("airportName")}
                placeholder="اسم المطار"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
              {errors && (
                <span className="text-red-500 text-sm">
                  {errors.airportName?.message}
                </span>
              )}
            </div>
            <div className="flex-grow">
              <label className="text-white">اختر اسم خط الطيران </label>
              <Select
                isMulti
                options={options}
                value={selectedOptions}
                noOptionsMessage={() => "لا توجد خطوط طيران"}
                backspaceRemovesValue
                hideSelectedOptions
                className="flex-grow w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                onChange={handleSelect}
              />
            </div>
            <div className="mb-5 pt-3">
              <div className="-mx-3 flex flex-wrap">
                {updateMode && (
                  <div className="w-full px-3 sm:w-1/2">
                    <label className="text-white">
                      تفعيل المطار أو إلغاء تفعيل المطار ؟
                    </label>
                    <div className="mb-5">
                      <Switch
                        checked={airportStatus}
                        onChange={(e) => {
                          setAirportStatus(e.target.checked);
                        }}
                        color="success"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              {updateMode ? (
                <button
                  onClick={handleSubmit(updateAirport)}
                  disabled={isSubmitting}
                  className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                >
                  تحديث المطار
                </button>
              ) : (
                <button
                  disabled={isSubmitting}
                  onClick={handleSubmit(storeAirport)}
                  className="text-center text-xl mb-3 p-2 w-52 font-bold text-white bg-green-700 rounded-2xl hover:bg-green-400 mx-auto block"
                >
                  تسجيل مطار جديد
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <div className="divider"></div>

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
            onChange={(e) => setSearchValue(e.target.value)}
            className="block w-full p-4 pb-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="البحث باسم المطار"
            required
          />
        </div>
      </div>

      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              الترتيب
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              اسم المطار
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              الحالة
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              خطوط الطيران
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              التاريخ/الوقت
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              تعديل البيانات
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredAirports.map((airport, index) => {
            const { name, id, status, created_at, airLines } = airport;
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
                  <span className="rounded  px-2 text-xs font-bold">
                    {name}
                  </span>
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800   border border-b text-center block lg:table-cell relative lg:static">
                  {status === "مفعل" ? (
                    <div className="bg-green-500 min-w-20 py-1 text-white text-sm rounded-lg">
                      مفعل
                    </div>
                  ) : (
                    <div className="bg-red-500 min-w-20 py-1 text-white rounded-lg text-sm">
                      غير مفعل
                    </div>
                  )}
                </td>
                <td className="w-full lg:w-auto p-2 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                  {airLines.map((airline, index) => (
                    <p
                      key={index}
                      className="rounded bg-blue-200 px-2 py-1  w-fit my-1 mx-auto text-xs font-bold"
                    >
                      {index + 1}-{airline.name}
                    </p>
                  ))}
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
                      setUpdateAirportID(id);
                      setValue("airportName", name);
                      setUpdateMode(true);
                      setAirportStatus(status === "مفعل" ? true : false);
                      showAirPortById(id);
                    }}
                    className="bg-green-700 text-white p-2 rounded hover:bg-green-500"
                  >
                    <DriveFileRenameOutlineIcon />
                  </button>
                  <button
                    onClick={() => deleteAirport(id)}
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
  );
}

export default Airports;
