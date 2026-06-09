export const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "IN_REVIEW":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "COMPLETED":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};
