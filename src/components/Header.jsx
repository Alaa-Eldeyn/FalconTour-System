

// this page contain header and asidbar 
import MenuBookIcon from '@mui/icons-material/MenuBook'; 
import { useNavigate , Link } from 'react-router-dom';
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import { toast } from 'react-toastify';
 
function Header() {
    const Navigate = useNavigate();
    
    //handel logout 
    function handelLogout() {
      if (localStorage.getItem('user_token')) {
        localStorage.removeItem("user_token");
        localStorage.removeItem("user_role_name");
        Navigate("/login")
        toast("تم تسجيل الخروج بنجاح", { type: "success"});
      } else {
          return null;
      }
  }
  return (
    <>
      <div className=" flex justify-between items-center h-20 px-4 w-full bg-[#111827]">
        <div className="flex-1">
          <Link
            to="/dashboard/profile"
            className="btn text-blue-600 hover:bg-gray-600 hover:text-white rounded-xl btn-ghost normal-case ml-4 bg-gray-200 text-sm"
          >
            <AccountBoxIcon sx={{ fontSize: 35 }} />
            الصفحة الشخصية
          </Link>
          <Link
            to="/dashboard"
            className="btn text-blue-600 hover:bg-gray-600 hover:text-white rounded-xl btn-ghost normal-case bg-gray-200 text-sm"
          >
            <MenuBookIcon sx={{ fontSize: 35 }} />
            الصندوق اليومي
          </Link>
        </div>

        <div className="flex-none gap-2">
          <a
            onClick={handelLogout}
            className="bg-red-500 hover:bg-red-800 transition  btn border-none text-white cursor-pointer text-sm rounded-xl"
          >
            تسجيل الخروج
            <LogoutIcon className="mr-2" />
          </a>
        </div>
      </div>
    </>
  );}

export default Header