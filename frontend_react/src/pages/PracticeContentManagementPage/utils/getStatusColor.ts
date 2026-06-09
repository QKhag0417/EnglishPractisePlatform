export const getStatusColor = (status: string) => {
  switch (status) {
    case "Published":
      return "bg-[#020617] text-white border-[#020617]";
    case "Draft":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};
