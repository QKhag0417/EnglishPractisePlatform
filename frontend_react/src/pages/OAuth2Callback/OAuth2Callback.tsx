import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function OAuth2Callback() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      return;
    }

    const role = String(user.role).toLowerCase();

    if (role === "administrator") {
      navigate("/content-management", { replace: true });
    } else if (role === "tutor") {
      navigate("/tutor/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  return <div></div>;
}
