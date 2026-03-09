export function mapPracticeSkill(skill: string): string {
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
      return skill;
  }
}
