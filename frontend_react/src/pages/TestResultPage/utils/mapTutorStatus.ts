export function mapTutorStatus(status?: string): string {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "IN_REVIEW":
      return "In Review";
    case "COMPLETED":
      return "Completed";
    default:
      return "Pending";
  }
}
