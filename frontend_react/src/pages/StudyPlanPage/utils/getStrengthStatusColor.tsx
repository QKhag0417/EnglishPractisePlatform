import { BackendStrengthStatus } from "../types";

export const getStrengthStatusColor = (status: BackendStrengthStatus) => {
  switch (status) {
    case "MAINTAINED":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "IMPROVED":
      return "bg-green-100 text-green-800 border-green-300";
    case "WEAKENED":
      return "bg-orange-100 text-orange-800 border-orange-300";
  }
};
