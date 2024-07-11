import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PersonPinIcon from "@mui/icons-material/PersonPin";
function Profile() {
  const baseUrl = import.meta.env.VITE_SOME_KEY;

  const navigate = useNavigate();
  const userToken = localStorage.getItem("user_token");
  const [isError, setIsError] = useState(false);
  const [userProfile, setUserprofile] = useState([]);
  const [loader, setLoader] = useState(true);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [branchID, setBranchID] = useState("");

  const handleUnauthenticated = () => {
    toast("يجب عليك تسجيل الدخول مرة ثانية لانتهاء الصلاحية", {
      type: "error",
      autoClose: 4000,
    });
    navigate("/login");
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_role_name");
  };
  useEffect(() => {
    refreshUser();
  }, []);
  const refreshUser = async () => {
    setLoader(true);
    await axios
      .get(`${baseUrl}refresh`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(function (response) {
        setLoader(false);
        setUserprofile(response.data.Admin);
        setName(response.data.Admin.name);
        setPhoneNumber(response.data.Admin.phone_number);
        setBranchID(response.data.Admin.branch.name);
      })
      .catch(function (error) {
        if (error.response?.data?.message === "Unauthenticated.") {
          handleUnauthenticated();
          return;
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const handleUpdate = (e) => {
    e.preventDefault();
    if (!name || !phoneNumber) {
      toast.error("الرجاء ملء جميع الحقول");
      return;
    }
    setLoader(true);
    axios
      .post(
        `${baseUrl}update`,
        {
          name: name,
          phone_number: phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then(function () {
        toast.success("تم تحديث البيانات بنجاح");
        refreshUser();
      })
      .catch(function (error) {
        toast.error("لم يتم تعديل البيانات");
        console.log(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const changePassword = async (e) => {
    setLoader(true);
    e.preventDefault();
    if (
      newPassword.trim() === "" &&
      confirmNewPassword.trim() === "" &&
      oldPassword.trim() === ""
    ) {
      setIsError(true);
      setLoader(false);
      return;
    }
    if (newPassword.trim() !== confirmNewPassword.trim()) {
      toast("كلمة المرور غير متطابقة", { type: "error" });
      setLoader(false);
      return;
    }
    if (newPassword.trim().length < 6 && confirmNewPassword.trim().length < 6) {
      setLoader(false);
      setIsError(true);
      return;
    }
    await axios
      .post(
        `${baseUrl}change-password`,
        {
          current_password: oldPassword,
          password: newPassword,
          password_confirmation: confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          toast("تم تغيير كلمة السر بنجاح", { type: "success" });
          setOldPassword("");
          setConfirmNewPassword("");
          setNewPassword("");
        }
      })
      .catch((error) => {
        if (error.response.data.message === "The password is incorrect.") {
          toast("كلمة المررو القديمة غير صحيحة", { type: "error" });
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <div className="items-center justify-center">
      <div className="mx-auto w-full max-w-[750px] bg-white">
        <form>
          <div className="mb-0 pt-0">
            <div>
              <div className="flex justify-center items-center flex-col mb-10">
                <PersonPinIcon sx={{ fontSize: 190 }} />
                <h1 className="mb-5 mt-5 text-2xl font-bold text-black-600">
                  المعلومات الشخصية
                </h1>
                <div className="bg-white overflow-hidden shadow  rounded-lg border">
                  <div className="border-t border-gray-200 px-5 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200 ">
                      <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-lg font-medium text-gray-500">
                          الاسم :
                        </dt>
                        <dd className="mt-1 text-lg text-gray-900 sm:mt-0 sm:col-span-2">
                          {userProfile.name}
                        </dd>
                      </div>
                      <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-lg font-medium text-gray-500">
                          البريد الإلكتروني :
                        </dt>
                        <dd className="mt-1 text-lg text-gray-900 sm:mt-0 sm:col-span-2">
                          {userProfile.email}
                        </dd>
                      </div>
                      <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-lg font-medium text-gray-500">
                          رقم الهاتف :
                        </dt>
                        <dd className="mt-1 text-lg text-gray-900 sm:mt-0 sm:col-span-2">
                          {userProfile.phone_number}
                        </dd>
                      </div>
                      <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-lg font-medium text-gray-500">
                          دور المستخدم :
                        </dt>
                        <dd className="mt-1 text-lg text-gray-900 sm:mt-0 sm:col-span-2">
                          {userProfile.role_name}
                        </dd>
                      </div>
                      {userProfile.role_name === "admin" && (
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-lg font-medium text-gray-500">
                            الفرع :
                          </dt>
                          <dd className="mt-1 text-lg text-gray-900 sm:mt-0 sm:col-span-2">
                            {branchID}
                          </dd>
                        </div>
                      )}
                      <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-lg font-medium text-gray-500">
                          وقت إنشاء الحساب :
                        </dt>
                        <dd className="mt-1 text-lg text-gray-900 sm:mt-0 sm:col-span-2">
                          {userProfile.created_at}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            {/* Rest of the form */}
          </div>
        </form>
      </div>
      <h3 className="flex items-center w-full">
        <span className="flex-grow bg-gray-200 rounded h-1"></span>
        <button className="mx-2 px-3 py-1 text-lg font-medium  border-2 rounded-full hover:bg-gray-200">
          تعديل البيانات الشخصية
        </button>
        <span className="flex-grow bg-gray-200 rounded h-1"></span>
      </h3>
      {/* change name || phone */}
      <div className="items-center justify-center p-12">
        <div className="rounded-3xl mx-auto w-full max-w-[750px] bg-gray-700 text-white p-10">
          <form>
            <div className="mb-5">
              <label className="mb-3 block text-base font-medium ">الاسم</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                defaultValue={loader ? userProfile?.name : ""}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-5">
              <label className="mb-3 block text-base font-medium">
                رقم الهاتف
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                defaultValue={loader ? userProfile?.phone_number : ""}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div>
              <button
                onClick={(e) => {
                  handleUpdate(e);
                }}
                className="hover:shadow-form rounded-md bg-success hover:bg-success/90 py-3 px-8 text-base font-semibold text-white outline-none"
              >
                تعديل
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* change passwrod  */}
      <h3 className="flex items-center w-full">
        <span className="flex-grow bg-gray-200 rounded h-1"></span>
        <button className="mx-2 px-3 py-1 text-lg font-medium  border-2 rounded-full hover:bg-gray-200">
          تغيير كلمة السر
        </button>
        <span className="flex-grow bg-gray-200 rounded h-1"></span>
      </h3>
      <div className="items-center justify-center p-12">
        <div className="rounded-3xl mx-auto w-full max-w-[750px] bg-gray-700 text-white p-10">
          <form>
            <div className="mb-5">
              <label className="mb-3 block text-base font-medium ">
                كلمة السر الحالية
              </label>
              <input
                type="password"
                name="name"
                id="name"
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value);
                  setIsError(false);
                }}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
              {isError && (
                <p className="text-red-500 text-sm">ادخل كلمة المرور الحالية</p>
              )}
            </div>
            <div className="mb-5">
              <label className="mb-3 block text-base font-medium">
                كلمة السر الجديدة
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setIsError(false);
                }}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
              {isError && (
                <p className="text-red-500 text-sm">
                  كلمة المرور يجب ان تكون اكبر من 6 احرف
                </p>
              )}
            </div>

            <div className="mb-5">
              <label className="mb-3 block text-base font-medium">
                تأكيد كلمة السر الجديدة
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => {
                  setConfirmNewPassword(e.target.value);
                  setIsError(false);
                }}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
              {isError && (
                <p className="text-red-500 text-sm">
                  كلمة المرور يجب ان تكون اكبر من 6 احرف
                </p>
              )}
            </div>

            <div>
              <button
                onClick={(e) => changePassword(e)}
                className="hover:shadow-form rounded-md bg-success hover:bg-success/90 py-3 px-8 text-base font-semibold text-white outline-none"
              >
                تغيير
              </button>
            </div>
          </form>
        </div>
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

export default Profile;
