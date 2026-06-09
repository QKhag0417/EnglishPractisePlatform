export function mapSkill(
  skill?: string,
): "Listening" | "Reading" | "Writing" | "Speaking" {
  switch (skill) {
    case "LISTENING":
      return "Listening";
    case "READING":
      return "Reading";
    case "WRITING":
      return "Writing";
    case "SPEAKING":
      return "Speaking";
    default:
      return "Listening";
  }
}
