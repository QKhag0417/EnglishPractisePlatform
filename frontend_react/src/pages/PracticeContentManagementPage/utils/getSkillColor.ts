export const getSkillColor = (skill: string) => {
  switch (skill) {
    case "Listening":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "Reading":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Writing":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "Speaking":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};
