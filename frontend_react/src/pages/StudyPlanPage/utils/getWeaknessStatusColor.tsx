import { BackendWeaknessStatus } from "../types";

export const getWeaknessStatusColor = (status: BackendWeaknessStatus) => {
  switch (status) {
    case "WORSENED":
      return "bg-red-100 text-red-800 border-red-300";
    case "CONTINUED":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "IMPROVED":
      return "bg-green-100 text-green-800 border-green-300";
  }
};
