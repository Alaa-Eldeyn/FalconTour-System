import { NavLink, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AddHomeWorkOutlinedIcon from "@mui/icons-material/AddHomeWorkOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { toast } from "react-toastify";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CategoryIcon from "@mui/icons-material/Category";
import LocalAirportIcon from "@mui/icons-material/LocalAirport";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import PaidIcon from "@mui/icons-material/Paid";
import ConnectingAirportsIcon from "@mui/icons-material/ConnectingAirports";
import GroupsIcon from "@mui/icons-material/Groups";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import BuildIcon from "@mui/icons-material/Build";
import logo from "../assets/Logo.png";

function Sidebar() {
  const Navigate = useNavigate();
  const userToken = localStorage.getItem("user_token");
  function handelLogout() {
    if (userToken) {
      localStorage.removeItem("user_token");
      localStorage.removeItem("user_role_name");
      Navigate("/login");
      toast("تم تسجيل الخروج بنجاح", { type: "success" });
    } else {
      return null;
    }
  }

  const userRoleName = localStorage.getItem("user_role_name");

  let SidebarItems = [];

  if (userRoleName === "admin") {
    SidebarItems = [
      {
        text: "تقارير العملاء ",
        path: "clients_report",
        icon: <BadgeOutlinedIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "تقارير كشف حساب ",
        path: "bill_summary",
        icon: <LibraryBooksOutlinedIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدارة العملاء",
        path: "clients",
        icon: <GroupsIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "تصنيف الرحلات ",
        path: "Categories",
        icon: <CategoryIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدارة خطوط الطيران",
        path: "airlines",
        icon: <ConnectingAirportsIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدارة المطارات",
        path: "airports",
        icon: <FlightTakeoffIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدارة العملات",
        path: "currencies",
        icon: <PaidIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدارة طرق الدفع",
        path: "payments",
        icon: <CreditCardIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدارة الحجز",
        path: "booking",
        icon: <SupportAgentIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدارة الرحلات",
        path: "trips",
        icon: <LocalAirportIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدارة الخدمات ",
        path: "services",
        icon: <SettingsSuggestIcon sx={{ fontSize: 35 }} />,
      },
    ];
  } else if (userRoleName === "super_admin") {
    SidebarItems = [
      {
        text: "تقارير العملاء ",
        path: "clients_report",
        icon: <BadgeOutlinedIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "تقارير كشف حساب ",
        path: "bill_summary",
        icon: <LibraryBooksOutlinedIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إضافة سوبر أدمن جديد",
        path: "add_super_admin",
        icon: <SensorOccupiedIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدارة الفروع",
        path: "branches",
        icon: <AddHomeWorkOutlinedIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدارة الموظفين",
        path: "employees",
        icon: <GroupAddOutlinedIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدارة العملاء",
        path: "clients",
        icon: <GroupsIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدراة الحجز",
        path: "booking",
        icon: <SupportAgentIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدارة الرحلات",
        path: "trips",
        icon: <LocalAirportIcon sx={{ fontSize: 35 }} />,
      },
      {
        text: "إدارة الخدمات ",
        path: "services",
        icon: <SettingsSuggestIcon sx={{ fontSize: 35 }} />,
      },

      {
        text: "الإعدادات",
        path: "settings",
        icon: <BuildIcon sx={{ fontSize: 35 }} />,
      },
    ];
  }

  return (
    <>
      <aside
        className="w-[70px] relative flex flex-col md:w-72 !min-h-screen h-[100%] pb-5 px-5 overflow-hidden bg-white dark:bg-gray-900 dark:border-gray-700"
      >
        <div className="logo flex justify-center items-center ">
          <Link to="/dashboard">
            <img src={logo} alt="logo" className="w-80 pt-2 text-white" />
          </Link>
        </div>

        <div className="flex flex-col justify-between flex-1">
          <nav className="flex-1 -mx-3 space-y-3 ">
            <ul className=" font-medium">
              {SidebarItems.map((item, index) => {
                return (
                  <li key={index} className=" my-[.5rem]">
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `${
                          isActive ? "bg-gray-700  " : null
                        } flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`
                      }
                    >
                      <div>
                        {item.icon}
                        <span className="ms-6 text-sm font-bold asidbaritems">
                          {item.text}
                        </span>
                      </div>
                    </NavLink>
                    <div className="h-0.5 mt-0.5 w-full bg-gray-700"></div>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="mt-6">
            <div className="flex items-center justify-between mt-6">
              <button
                id="logout"
                onClick={handelLogout}
                className="hidden md:block text-white w-full bg-red-700 p-2 rounded-lg hover:bg-red-400"
              >
                تسجيل الخروج
                <LogoutOutlinedIcon />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
