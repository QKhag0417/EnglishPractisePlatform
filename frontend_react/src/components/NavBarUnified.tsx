import { useAuth } from "../contexts/AuthContext";
import { NavBarGuest, NavBarLearner } from "./NavBar";
import { NavBarTutor } from "./NavBarTutor";
import { NavBarAdmin } from "./NavBarAdmin";

export function NavBarUnified() {
  const { user } = useAuth();

  const role = user?.role ?? null;

  switch (role) {
    case "learner":
      return <NavBarLearner />;

    case "tutor":
      return <NavBarTutor />;

    case "administrator":
      return <NavBarAdmin />;

    default:
      return <NavBarGuest />;
  }
}
