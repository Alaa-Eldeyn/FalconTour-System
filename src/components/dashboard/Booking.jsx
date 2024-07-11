import { Link } from "react-router-dom";
import ConnectingAirportsIcon from "@mui/icons-material/ConnectingAirports";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AdsClickIcon from "@mui/icons-material/AdsClick";
const Booking = () => {
  return (
    <>
      <p className="text-center text-3xl font-bold text-gray-900 -mb-5 underline underline-offset-4 decoration-blue-500">
        اختر خدمة
        <AdsClickIcon sx={{ fontSize: 40 }} />
      </p>
      <section className="flex justify-evenly flex-col md:flex-row gap-5 items-center text-center min-h-[80vh]">
        <div className="w-1/2 max-w-[400px] rounded-lg h-[200px] p-5 flex justify-center items-center text-3xl font-bold cursor-pointer hover:scale-105 hover:tracking-wider transition-all duration-300 ease-in-out hover:bg-gray-700 hover:shadow-lg bg-gray-900 text-white">
          <Link
            to={"trip"}
            className="w-full h-full flex justify-center items-center"
          >
            حجز رحلة
            <ConnectingAirportsIcon sx={{ fontSize: 55 }} />
          </Link>
        </div>
        <div className="w-1/2 max-w-[400px] rounded-lg h-[200px] p-5 flex justify-center items-center text-3xl font-bold cursor-pointer hover:scale-105 hover:tracking-wider transition-all duration-300 ease-in-out hover:bg-gray-700 hover:shadow-lg bg-gray-900 text-white">
          <Link
            to={"service"}
            className="w-full h-full flex justify-center items-center"
          >
            حجز خدمات أخري
            <ManageAccountsIcon sx={{ fontSize: 55 }} />
          </Link>
        </div>
      </section>
    </>
  );
};

export default Booking;
