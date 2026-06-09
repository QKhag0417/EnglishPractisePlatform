export type ListeningQuestionType =
  | "Multiple Choice"
  | "Matching"
  | "Plan Labelling"
  | "Map Labelling"
  | "Diagram Labelling"
  | "Form Completion"
  | "Note Completion"
  | "Table Completion"
  | "Flow-chart Completion"
  | "Summary Completion"
  | "Sentence Completion"
  | "Short-answer Questions";

export type BackendListeningQuestionType =
  | "MULTIPLE_CHOICE"
  | "MATCHING"
  | "PLAN_LABELLING"
  | "MAP_LABELLING"
  | "DIAGRAM_LABELLING"
  | "FORM_COMPLETION"
  | "NOTE_COMPLETION"
  | "TABLE_COMPLETION"
  | "FLOW_CHART_COMPLETION"
  | "SUMMARY_COMPLETION"
  | "SENTENCE_COMPLETION"
  | "SHORT_ANSWER_QUESTIONS";

export function mapListeningApiTypeToUi(
  apiType: BackendListeningQuestionType,
): ListeningQuestionType {
  switch (apiType) {
    case "MULTIPLE_CHOICE":
      return "Multiple Choice";
    case "MATCHING":
      return "Matching";
    case "PLAN_LABELLING":
      return "Plan Labelling";
    case "MAP_LABELLING":
      return "Map Labelling";
    case "DIAGRAM_LABELLING":
      return "Diagram Labelling";
    case "FORM_COMPLETION":
      return "Form Completion";
    case "NOTE_COMPLETION":
      return "Note Completion";
    case "TABLE_COMPLETION":
      return "Table Completion";
    case "FLOW_CHART_COMPLETION":
      return "Flow-chart Completion";
    case "SUMMARY_COMPLETION":
      return "Summary Completion";
    case "SENTENCE_COMPLETION":
      return "Sentence Completion";
    case "SHORT_ANSWER_QUESTIONS":
      return "Short-answer Questions";
    default:
      return "Multiple Choice";
  }
}

export function mapListeningUiTypeToApi(
  type: ListeningQuestionType,
): BackendListeningQuestionType {
  switch (type) {
    case "Multiple Choice":
      return "MULTIPLE_CHOICE";
    case "Matching":
      return "MATCHING";
    case "Plan Labelling":
      return "PLAN_LABELLING";
    case "Map Labelling":
      return "MAP_LABELLING";
    case "Diagram Labelling":
      return "DIAGRAM_LABELLING";
    case "Form Completion":
      return "FORM_COMPLETION";
    case "Note Completion":
      return "NOTE_COMPLETION";
    case "Table Completion":
      return "TABLE_COMPLETION";
    case "Flow-chart Completion":
      return "FLOW_CHART_COMPLETION";
    case "Summary Completion":
      return "SUMMARY_COMPLETION";
    case "Sentence Completion":
      return "SENTENCE_COMPLETION";
    case "Short-answer Questions":
      return "SHORT_ANSWER_QUESTIONS";
    default:
      return "MULTIPLE_CHOICE";
  }
}

export interface Question {
  id?: string;
  tempId: string;
  number: number;
  type: ListeningQuestionType;
  correctAnswer: string;
  questionType: ListeningQuestionType;
  topicTag: TopicTag;
  correctAnswers: string[];
}

export type UploadValue = File | string | null;

export type TopicTag =
  | "Education and Learning"
  | "Work, Jobs and Careers"
  | "Technology, Internet and AI"
  | "Health, Healthcare and Lifestyle"
  | "Environment, Climate and Sustainability"
  | "Government, Law and Public Policy"
  | "Society, Social Behavior and Values"
  | "Family, Children and Ageing"
  | "Media, Advertising and Communication"
  | "Culture, Art, Traditions and Language"
  | "Travel, Tourism and Transport"
  | "Housing, Cities and Urban/Rural Life"
  | "Science, Research and Innovation"
  | "Business, Economy and Consumer Behavior"
  | "Food, Agriculture and Farming"
  | "Sport, Leisure and Hobbies"
  | "History, Archaeology and Heritage"
  | "Energy, Natural Resources and Infrastructure"
  | "Crime, Safety and Security"
  | "Globalisation, Migration and International Development"
  | "Population and Demographics"
  | "Animals and Wildlife";

export type BackendTopicTag =
  | "EDUCATION_AND_LEARNING"
  | "WORK_JOBS_AND_CAREERS"
  | "TECHNOLOGY_INTERNET_AND_AI"
  | "HEALTH_HEALTHCARE_AND_LIFESTYLE"
  | "ENVIRONMENT_CLIMATE_AND_SUSTAINABILITY"
  | "GOVERNMENT_LAW_AND_PUBLIC_POLICY"
  | "SOCIETY_SOCIAL_BEHAVIOR_AND_VALUES"
  | "FAMILY_CHILDREN_AND_AGEING"
  | "MEDIA_ADVERTISING_AND_COMMUNICATION"
  | "CULTURE_ART_TRADITIONS_AND_LANGUAGE"
  | "TRAVEL_TOURISM_AND_TRANSPORT"
  | "HOUSING_CITIES_AND_URBAN_RURAL_LIFE"
  | "SCIENCE_RESEARCH_AND_INNOVATION"
  | "BUSINESS_ECONOMY_AND_CONSUMER_BEHAVIOR"
  | "FOOD_AGRICULTURE_AND_FARMING"
  | "SPORT_LEISURE_AND_HOBBIES"
  | "HISTORY_ARCHAEOLOGY_AND_HERITAGE"
  | "ENERGY_NATURAL_RESOURCES_AND_INFRASTRUCTURE"
  | "CRIME_SAFETY_AND_SECURITY"
  | "GLOBALISATION_MIGRATION_AND_INTERNATIONAL_DEVELOPMENT"
  | "POPULATION_AND_DEMOGRAPHICS"
  | "ANIMALS_AND_WILDLIFE";

export function mapTopicTagApiToUi(apiType: BackendTopicTag): TopicTag {
  switch (apiType) {
    case "EDUCATION_AND_LEARNING":
      return "Education and Learning";
    case "WORK_JOBS_AND_CAREERS":
      return "Work, Jobs and Careers";
    case "TECHNOLOGY_INTERNET_AND_AI":
      return "Technology, Internet and AI";
    case "HEALTH_HEALTHCARE_AND_LIFESTYLE":
      return "Health, Healthcare and Lifestyle";
    case "ENVIRONMENT_CLIMATE_AND_SUSTAINABILITY":
      return "Environment, Climate and Sustainability";
    case "GOVERNMENT_LAW_AND_PUBLIC_POLICY":
      return "Government, Law and Public Policy";
    case "SOCIETY_SOCIAL_BEHAVIOR_AND_VALUES":
      return "Society, Social Behavior and Values";
    case "FAMILY_CHILDREN_AND_AGEING":
      return "Family, Children and Ageing";
    case "MEDIA_ADVERTISING_AND_COMMUNICATION":
      return "Media, Advertising and Communication";
    case "CULTURE_ART_TRADITIONS_AND_LANGUAGE":
      return "Culture, Art, Traditions and Language";
    case "TRAVEL_TOURISM_AND_TRANSPORT":
      return "Travel, Tourism and Transport";
    case "HOUSING_CITIES_AND_URBAN_RURAL_LIFE":
      return "Housing, Cities and Urban/Rural Life";
    case "SCIENCE_RESEARCH_AND_INNOVATION":
      return "Science, Research and Innovation";
    case "BUSINESS_ECONOMY_AND_CONSUMER_BEHAVIOR":
      return "Business, Economy and Consumer Behavior";
    case "FOOD_AGRICULTURE_AND_FARMING":
      return "Food, Agriculture and Farming";
    case "SPORT_LEISURE_AND_HOBBIES":
      return "Sport, Leisure and Hobbies";
    case "HISTORY_ARCHAEOLOGY_AND_HERITAGE":
      return "History, Archaeology and Heritage";
    case "ENERGY_NATURAL_RESOURCES_AND_INFRASTRUCTURE":
      return "Energy, Natural Resources and Infrastructure";
    case "CRIME_SAFETY_AND_SECURITY":
      return "Crime, Safety and Security";
    case "GLOBALISATION_MIGRATION_AND_INTERNATIONAL_DEVELOPMENT":
      return "Globalisation, Migration and International Development";
    case "POPULATION_AND_DEMOGRAPHICS":
      return "Population and Demographics";
    case "ANIMALS_AND_WILDLIFE":
      return "Animals and Wildlife";
    default:
      return "Education and Learning";
  }
}

export function mapTopicTagUiToApi(type: TopicTag): BackendTopicTag {
  switch (type) {
    case "Education and Learning":
      return "EDUCATION_AND_LEARNING";
    case "Work, Jobs and Careers":
      return "WORK_JOBS_AND_CAREERS";
    case "Technology, Internet and AI":
      return "TECHNOLOGY_INTERNET_AND_AI";
    case "Health, Healthcare and Lifestyle":
      return "HEALTH_HEALTHCARE_AND_LIFESTYLE";
    case "Environment, Climate and Sustainability":
      return "ENVIRONMENT_CLIMATE_AND_SUSTAINABILITY";
    case "Government, Law and Public Policy":
      return "GOVERNMENT_LAW_AND_PUBLIC_POLICY";
    case "Society, Social Behavior and Values":
      return "SOCIETY_SOCIAL_BEHAVIOR_AND_VALUES";
    case "Family, Children and Ageing":
      return "FAMILY_CHILDREN_AND_AGEING";
    case "Media, Advertising and Communication":
      return "MEDIA_ADVERTISING_AND_COMMUNICATION";
    case "Culture, Art, Traditions and Language":
      return "CULTURE_ART_TRADITIONS_AND_LANGUAGE";
    case "Travel, Tourism and Transport":
      return "TRAVEL_TOURISM_AND_TRANSPORT";
    case "Housing, Cities and Urban/Rural Life":
      return "HOUSING_CITIES_AND_URBAN_RURAL_LIFE";
    case "Science, Research and Innovation":
      return "SCIENCE_RESEARCH_AND_INNOVATION";
    case "Business, Economy and Consumer Behavior":
      return "BUSINESS_ECONOMY_AND_CONSUMER_BEHAVIOR";
    case "Food, Agriculture and Farming":
      return "FOOD_AGRICULTURE_AND_FARMING";
    case "Sport, Leisure and Hobbies":
      return "SPORT_LEISURE_AND_HOBBIES";
    case "History, Archaeology and Heritage":
      return "HISTORY_ARCHAEOLOGY_AND_HERITAGE";
    case "Energy, Natural Resources and Infrastructure":
      return "ENERGY_NATURAL_RESOURCES_AND_INFRASTRUCTURE";
    case "Crime, Safety and Security":
      return "CRIME_SAFETY_AND_SECURITY";
    case "Globalisation, Migration and International Development":
      return "GLOBALISATION_MIGRATION_AND_INTERNATIONAL_DEVELOPMENT";
    case "Population and Demographics":
      return "POPULATION_AND_DEMOGRAPHICS";
    case "Animals and Wildlife":
      return "ANIMALS_AND_WILDLIFE";
    default:
      return "EDUCATION_AND_LEARNING";
  }
}
