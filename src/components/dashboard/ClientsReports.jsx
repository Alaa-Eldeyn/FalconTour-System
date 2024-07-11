import { Link } from "react-router-dom";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
const ClientsReports = () => {
  return (
    <>
      <p className="text-center text-3xl font-bold text-gray-900 -mb-5 underline underline-offset-4 decoration-blue-500">
        اختر نوع التقارير
        <AdsClickIcon sx={{ fontSize: 40 }} />
      </p>
      <section className="flex justify-evenly flex-col md:flex-row gap-5 items-center text-center min-h-[80vh]">
        <div className="w-1/2 max-w-[400px] rounded-lg h-[200px] p-5 flex justify-center items-center text-3xl font-bold cursor-pointer hover:scale-105  transition-all duration-300 ease-in-out hover:bg-gray-700 hover:shadow-lg bg-gray-900 text-white">
          <Link
            to={"daily_clients_reports"}
            className="w-full h-full flex justify-center items-center"
          >
            تقارير يومية
            <LibraryBooksIcon sx={{ fontSize: 55, marginRight: 3 }} />
          </Link>
        </div>
        <div className="w-1/2 max-w-[400px] rounded-lg h-[200px] p-5 flex justify-center items-center text-3xl font-bold cursor-pointer hover:scale-105  transition-all duration-300 ease-in-out hover:bg-gray-700 hover:shadow-lg bg-gray-900 text-white">
          <Link
            to={"range_clients_reports"}
            className="w-full h-full flex justify-center items-center"
          >
            تقارير خلال فترة زمنية محددة
            <WatchLaterIcon sx={{ fontSize: 55, marginRight: 1 }} />
          </Link>
        </div>
      </section>
    </>
  );
};

export default ClientsReports;
