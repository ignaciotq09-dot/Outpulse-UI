import type { ICPDimension } from "@/types";

interface DimensionStyle {
  bg: string;
  text: string;
  border: string;
  dot: string;
}

export const DIMENSION_STYLES: Record<ICPDimension, DimensionStyle> = {
  industry: {
    bg: "bg-[hsl(210_60%_60%/0.15)]",
    text: "text-[hsl(210_60%_60%)]",
    border: "border-[hsl(210_60%_60%/0.4)]",
    dot: "bg-[hsl(210_60%_60%)]",
  },
  companySize: {
    bg: "bg-[hsl(175_55%_55%/0.15)]",
    text: "text-[hsl(175_55%_55%)]",
    border: "border-[hsl(175_55%_55%/0.4)]",
    dot: "bg-[hsl(175_55%_55%)]",
  },
  targetTitles: {
    bg: "bg-[hsl(265_55%_65%/0.15)]",
    text: "text-[hsl(265_55%_65%)]",
    border: "border-[hsl(265_55%_65%/0.4)]",
    dot: "bg-[hsl(265_55%_65%)]",
  },
  seniorityLevels: {
    bg: "bg-[hsl(280_50%_65%/0.15)]",
    text: "text-[hsl(280_50%_65%)]",
    border: "border-[hsl(280_50%_65%/0.4)]",
    dot: "bg-[hsl(280_50%_65%)]",
  },
  geos: {
    bg: "bg-[hsl(150_50%_55%/0.15)]",
    text: "text-[hsl(150_50%_55%)]",
    border: "border-[hsl(150_50%_55%/0.4)]",
    dot: "bg-[hsl(150_50%_55%)]",
  },
  painPoints: {
    bg: "bg-[hsl(350_60%_62%/0.15)]",
    text: "text-[hsl(350_60%_62%)]",
    border: "border-[hsl(350_60%_62%/0.4)]",
    dot: "bg-[hsl(350_60%_62%)]",
  },
  techStack: {
    bg: "bg-[hsl(190_60%_58%/0.15)]",
    text: "text-[hsl(190_60%_58%)]",
    border: "border-[hsl(190_60%_58%/0.4)]",
    dot: "bg-[hsl(190_60%_58%)]",
  },
  triggers: {
    bg: "bg-[hsl(38_95%_58%/0.15)]",
    text: "text-[hsl(38_95%_58%)]",
    border: "border-[hsl(38_95%_58%/0.4)]",
    dot: "bg-[hsl(38_95%_58%)]",
  },
  exclusions: {
    bg: "bg-[hsl(0_60%_55%/0.15)]",
    text: "text-[hsl(0_60%_55%)]",
    border: "border-[hsl(0_60%_55%/0.4)]",
    dot: "bg-[hsl(0_60%_55%)]",
  },
};

export function getDimensionStyle(d: ICPDimension): DimensionStyle {
  return DIMENSION_STYLES[d];
}

const DIMENSION_LABELS: Record<ICPDimension, string> = {
  industry: "Industry",
  companySize: "Company Size",
  targetTitles: "Target Titles",
  seniorityLevels: "Seniority Levels",
  geos: "Geography",
  painPoints: "Pain Points",
  techStack: "Tech Stack",
  triggers: "Triggers",
  exclusions: "Exclusions",
};

export function getDimensionLabel(d: ICPDimension): string {
  return DIMENSION_LABELS[d];
}
