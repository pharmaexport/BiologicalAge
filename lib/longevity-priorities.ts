import type { AssessmentResult, ComponentKey, Profile, Questionnaire } from "@/lib/biological-age";

export type PriorityKey =
  | "tobacco"
  | "activity"
  | "sedentary"
  | "sleep"
  | "nutrition"
  | "alcohol"
  | "stressRecovery"
  | "morphology";

export type LongevityPriority = {
  key: PriorityKey;
  severity: number;
  titleKey: string;
  actionKey: string;
  rationaleKey: string;
  targetKey: string;
  evidenceKey: string;
  estimateMinMonths: number;
  estimateMaxMonths: number;
  confidence: "high" | "medium" | "low";
};

const metadata: Record<PriorityKey, Omit<LongevityPriority, "key" | "severity" | "estimateMinMonths" | "estimateMaxMonths">> = {
  tobacco: { titleKey: "priorityTobaccoTitle", actionKey: "priorityTobaccoAction", rationaleKey: "priorityTobaccoRationale", targetKey: "targetTobacco", evidenceKey: "evidenceTobacco", confidence: "high" },
  activity: { titleKey: "priorityActivityTitle", actionKey: "priorityActivityAction", rationaleKey: "priorityActivityRationale", targetKey: "targetActivity", evidenceKey: "evidenceActivity", confidence: "high" },
  sedentary: { titleKey: "prioritySedentaryTitle", actionKey: "prioritySedentaryAction", rationaleKey: "prioritySedentaryRationale", targetKey: "targetSedentary", evidenceKey: "evidenceSedentary", confidence: "low" },
  sleep: { titleKey: "prioritySleepTitle", actionKey: "prioritySleepAction", rationaleKey: "prioritySleepRationale", targetKey: "targetSleep", evidenceKey: "evidenceSleep", confidence: "low" },
  nutrition: { titleKey: "priorityNutritionTitle", actionKey: "priorityNutritionAction", rationaleKey: "priorityNutritionRationale", targetKey: "targetNutrition", evidenceKey: "evidenceNutrition", confidence: "medium" },
  alcohol: { titleKey: "priorityAlcoholTitle", actionKey: "priorityAlcoholAction", rationaleKey: "priorityAlcoholRationale", targetKey: "targetAlcohol", evidenceKey: "evidenceAlcohol", confidence: "low" },
  stressRecovery: { titleKey: "priorityStressTitle", actionKey: "priorityStressAction", rationaleKey: "priorityStressRationale", targetKey: "targetStress", evidenceKey: "evidenceStress", confidence: "low" },
  morphology: { titleKey: "priorityMorphologyTitle", actionKey: "priorityMorphologyAction", rationaleKey: "priorityMorphologyRationale", targetKey: "targetMorphology", evidenceKey: "evidenceMorphology", confidence: "low" }
};

const weights: Record<PriorityKey, number> = {
  tobacco: 1.45,
  activity: 1.2,
  sedentary: 1.05,
  sleep: 1.1,
  nutrition: 1.15,
  alcohol: 1.15,
  stressRecovery: 1,
  morphology: 0.9
};

function componentDeficit(result: AssessmentResult, key: ComponentKey) {
  const component = result.components.find((item) => item.key === key);
  return component ? 1 - component.score / component.max : 0;
}

function estimateRange(key: PriorityKey, severity: number, age: number, questionnaire: Questionnaire): [number, number] {
  const factor = Math.max(0.25, severity / 100);
  if (key === "tobacco") {
    if (questionnaire.tobacco !== "current") return [0, Math.round(12 * factor)];
    const ageAdjustedYears = age <= 35 ? [6.1, 8.5] : age >= 65 ? [1.4, 3.7] : [6.1 - ((age - 35) / 30) * 4.7, 8.5 - ((age - 35) / 30) * 4.8];
    return [Math.round(ageAdjustedYears[0] * 12), Math.round(ageAdjustedYears[1] * 12)];
  }
  const ranges: Record<Exclude<PriorityKey, "tobacco">, [number, number]> = {
    activity: [12, 36],
    sedentary: [3, 15],
    sleep: [3, 18],
    nutrition: [12, 39],
    alcohol: [2, 18],
    stressRecovery: [2, 12],
    morphology: [6, 30]
  };
  const [min, max] = ranges[key];
  return [Math.max(1, Math.round(min * factor)), Math.max(2, Math.round(max * factor))];
}

export function calculateLongevityPriorities(
  profile: Profile,
  questionnaire: Questionnaire,
  result: AssessmentResult
): LongevityPriority[] {
  const candidates: Array<{ key: PriorityKey; deficit: number; urgency?: number }> = [
    { key: "tobacco", deficit: componentDeficit(result, "tobacco"), urgency: questionnaire.tobacco === "current" ? 0.35 : questionnaire.tobacco === "nicotine" ? 0.18 : 0 },
    { key: "activity", deficit: componentDeficit(result, "activity") },
    { key: "sedentary", deficit: componentDeficit(result, "sedentary") },
    { key: "sleep", deficit: componentDeficit(result, "sleep"), urgency: questionnaire.sleepHours !== null && questionnaire.sleepHours < 6 ? 0.12 : 0 },
    { key: "nutrition", deficit: componentDeficit(result, "nutrition") },
    { key: "alcohol", deficit: componentDeficit(result, "alcohol"), urgency: (questionnaire.alcoholDrinksPerWeek || 0) > 14 ? 0.15 : 0 },
    { key: "stressRecovery", deficit: componentDeficit(result, "stressRecovery"), urgency: (questionnaire.stressLevel || 0) >= 8 || (questionnaire.fatigueLevel || 0) >= 8 ? 0.1 : 0 },
    { key: "morphology", deficit: componentDeficit(result, "morphology"), urgency: profile.waistCm && profile.waistCm / profile.heightCm >= 0.6 ? 0.08 : 0 }
  ];

  return candidates
    .map(({ key, deficit, urgency = 0 }) => {
      const severity = Math.round(Math.min(1, deficit * weights[key] + urgency) * 100);
      const [estimateMinMonths, estimateMaxMonths] = estimateRange(key, severity, profile.age, questionnaire);
      return { key, severity, estimateMinMonths, estimateMaxMonths, ...metadata[key] };
    })
    .filter((item) => item.severity >= 12)
    .sort((a, b) => b.severity - a.severity)
    .slice(0, 3);
}
