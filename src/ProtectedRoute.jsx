import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const Navigate = useNavigate();
  const user = localStorage.getItem("user_token");
  useEffect(() => {
    if (!user) {
      return Navigate("/login");
    }
  }, [user]);
  return children;
};

export default ProtectedRoute;
