export type Software = {
  id: string;
  name: string;
  websiteUrl: string;
  category: string;
};

const softwareMock: Software[] = [
  { id: "notion", name: "Notion", websiteUrl: "https://notion.so", category: "Productivité" },
  { id: "slack", name: "Slack", websiteUrl: "https://slack.com", category: "Communication" },
  { id: "linear", name: "Linear", websiteUrl: "https://linear.app", category: "Gestion de projet" },
  { id: "figma", name: "Figma", websiteUrl: "https://figma.com", category: "Design" },
  { id: "aws", name: "AWS Console", websiteUrl: "https://aws.amazon.com", category: "Infrastructure" },
  { id: "datadog", name: "Datadog", websiteUrl: "https://datadoghq.com", category: "Monitoring" },
];

export function getAllSoftwareMock(): Software[] {
  return [...softwareMock];
}
