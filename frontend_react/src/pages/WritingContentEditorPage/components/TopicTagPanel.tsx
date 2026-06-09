import { useState } from "react";
import { Label } from "../../../components/ui/label";
import { SelectV2 } from "../../TutorDashboardPage/components";
import { Button } from "../../../components/ui/button";
import { TopicTag } from "../../ListeningContentEditorPage/types";

interface Props {
  topicTags: TopicTag[];
  onTopicTagsChange: (tags: TopicTag[]) => void;
}

export function TopicTagPanel({ topicTags, onTopicTagsChange }: Props) {
  // =========================
  // Topic tag state
  // =========================

  const [topicTag, setTopicTag] = useState<TopicTag>("Education and Learning");

  // =========================
  // Handle add topic tag
  // =========================

  const handleAddTopicTag = () => {
    if (!topicTag) return;
    if (topicTags.includes(topicTag)) return;

    onTopicTagsChange([...topicTags, topicTag]);
  };

  // =========================
  // Handle remove topic tag
  // =========================

  const handleRemoveTopicTag = () => {
    onTopicTagsChange(topicTags.filter((tag) => tag !== topicTag));
  };

  // =========================
  // Topic tag options
  // =========================

  const topicTagOptions: { value: TopicTag; label: string }[] = [
    { value: "Education and Learning", label: "Education and Learning" },
    { value: "Work, Jobs and Careers", label: "Work, Jobs and Careers" },
    {
      value: "Technology, Internet and AI",
      label: "Technology, Internet and AI",
    },
    {
      value: "Health, Healthcare and Lifestyle",
      label: "Health, Healthcare and Lifestyle",
    },
    {
      value: "Environment, Climate and Sustainability",
      label: "Environment, Climate and Sustainability",
    },
    {
      value: "Government, Law and Public Policy",
      label: "Government, Law and Public Policy",
    },
    {
      value: "Society, Social Behavior and Values",
      label: "Society, Social Behavior and Values",
    },
    {
      value: "Family, Children and Ageing",
      label: "Family, Children and Ageing",
    },
    {
      value: "Media, Advertising and Communication",
      label: "Media, Advertising and Communication",
    },
    {
      value: "Culture, Art, Traditions and Language",
      label: "Culture, Art, Traditions and Language",
    },
    {
      value: "Travel, Tourism and Transport",
      label: "Travel, Tourism and Transport",
    },
    {
      value: "Housing, Cities and Urban/Rural Life",
      label: "Housing, Cities and Urban/Rural Life",
    },
    {
      value: "Science, Research and Innovation",
      label: "Science, Research and Innovation",
    },
    {
      value: "Business, Economy and Consumer Behavior",
      label: "Business, Economy and Consumer Behavior",
    },
    {
      value: "Food, Agriculture and Farming",
      label: "Food, Agriculture and Farming",
    },
    {
      value: "Sport, Leisure and Hobbies",
      label: "Sport, Leisure and Hobbies",
    },
    {
      value: "History, Archaeology and Heritage",
      label: "History, Archaeology and Heritage",
    },
    {
      value: "Energy, Natural Resources and Infrastructure",
      label: "Energy, Natural Resources and Infrastructure",
    },
    {
      value: "Crime, Safety and Security",
      label: "Crime, Safety and Security",
    },
    {
      value: "Globalisation, Migration and International Development",
      label: "Globalisation, Migration and International Development",
    },
    {
      value: "Population and Demographics",
      label: "Population and Demographics",
    },
    { value: "Animals and Wildlife", label: "Animals and Wildlife" },
  ];

  return (
    <div className="bg-white rounded-[12px] p-[32px] shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-[20px]">
        <h3 className="font-['Inter'] font-semibold text-[18px] text-gray-900">
          Select Topics
        </h3>
      </div>

      <div className="mb-[8px]">
        <Label className="font-['Inter'] font-medium text-[14px] text-gray-700 mb-[12px] block">
          Topic tag
        </Label>

        <div className="flex gap-[8px]">
          <SelectV2
            value={topicTag}
            onChange={(value) => {
              setTopicTag(value as TopicTag);
            }}
            options={topicTagOptions}
            placeholder="Topic tag"
          />

          <Button
            onClick={handleAddTopicTag}
            disabled={topicTags.includes(topicTag)}
            className="bg-[#1977f3] hover:bg-[#1567d3]"
          >
            Add
          </Button>

          <Button
            onClick={handleRemoveTopicTag}
            disabled={!topicTags.includes(topicTag)}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
