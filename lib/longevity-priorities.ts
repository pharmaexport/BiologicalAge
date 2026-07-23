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
};

const metadata: Record<PriorityKey, Omit<LongevityPriority, "key" | "severity">> = {
  tobacco: { titleKey: "priorityTobaccoTitle", actionKey: "priorityTobaccoAction", rationaleKey: "priorityTobaccoRationale" },
  activity: { titleKey: "priorityActivityTitle", actionKey: "priorityActivityAction", rationaleKey: "priorityActivityRationale" },
  sedentary: { titleKey: "prioritySedentaryTitle", actionKey: "prioritySedentaryAction", rationaleKey: "prioritySedentaryRationale" },
  sleep: { titleKey: "prioritySleepTitle", actionKey: "prioritySleepAction", rationaleKey: "prioritySleepRationale" },
  nutrition: { titleKey: "priorityNutritionTitle", actionKey: "priorityNutritionAction", rationaleKey: "priorityNutritionRationale" },
  alcohol: { titleKey: "priorityAlcoholTitle", actionKey: "priorityAlcoholAction", rationaleKey: "priorityAlcoholRationale" },
  stressRecovery: { titleKey: "priorityStressTitle", actionKey: "priorityStressAction", rationaleKey: "priorityStressRationale" },
  morphology: { titleKey: "priorityMorphologyTitle", actionKey: "priorityMorphologyAction", rationaleKey: "priorityMorphologyRationale" }
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
    .map(({ key, deficit, urgency = 0 }) => ({
      key,
      severity: Math.round(Math.min(1, deficit * weights[key] + urgency) * 100),
      ...metadata[key]
    }))
    .filter((item) => item.severity >= 12)
    .sort((a, b) => b.severity - a.severity)
    .slice(0, 3);
}
