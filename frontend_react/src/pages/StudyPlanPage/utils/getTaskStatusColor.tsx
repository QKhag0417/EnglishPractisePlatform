import { BackendTaskStatus } from "../types";

export const getTaskStatusColor = (status: BackendTaskStatus) => {
  switch (status) {
    case "ACTIVE":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "COMPLETED":
      return "bg-green-100 text-green-800 border-green-300";
    case "FAILED":
      return "bg-red-100 text-red-800 border-red-300";
  }
};
