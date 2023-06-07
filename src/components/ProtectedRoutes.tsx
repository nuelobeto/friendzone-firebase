import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedRoutes = (props: any) => {
  const { isAllowed } = props;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAllowed) {
      navigate("/");
    } else {
      navigate("/chats");
    }
  }, [isAllowed, navigate]);

  return <Outlet />;
};

export default ProtectedRoutes;
