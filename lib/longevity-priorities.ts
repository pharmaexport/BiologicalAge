import type { AssessmentResult, ComponentKey, Profile, Questionnaire, SportType } from "@/lib/biological-age";

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
  rationaleKey: string;
  evidenceKey: string;
  estimateMinMonths: number;
  estimateMaxMonths: number;
  confidence: "high" | "medium" | "low";
  personalizedActions: string[];
};

const metadata: Record<PriorityKey, Omit<LongevityPriority, "key" | "severity" | "estimateMinMonths" | "estimateMaxMonths" | "personalizedActions">> = {
  tobacco: { titleKey: "priorityTobaccoTitle", rationaleKey: "priorityTobaccoRationale", evidenceKey: "evidenceTobacco", confidence: "high" },
  activity: { titleKey: "priorityActivityTitle", rationaleKey: "priorityActivityRationale", evidenceKey: "evidenceActivity", confidence: "high" },
  sedentary: { titleKey: "prioritySedentaryTitle", rationaleKey: "prioritySedentaryRationale", evidenceKey: "evidenceSedentary", confidence: "low" },
  sleep: { titleKey: "prioritySleepTitle", rationaleKey: "prioritySleepRationale", evidenceKey: "evidenceSleep", confidence: "low" },
  nutrition: { titleKey: "priorityNutritionTitle", rationaleKey: "priorityNutritionRationale", evidenceKey: "evidenceNutrition", confidence: "medium" },
  alcohol: { titleKey: "priorityAlcoholTitle", rationaleKey: "priorityAlcoholRationale", evidenceKey: "evidenceAlcohol", confidence: "low" },
  stressRecovery: { titleKey: "priorityStressTitle", rationaleKey: "priorityStressRationale", evidenceKey: "evidenceStress", confidence: "low" },
  morphology: { titleKey: "priorityMorphologyTitle", rationaleKey: "priorityMorphologyRationale", evidenceKey: "evidenceMorphology", confidence: "low" }
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

function activityActions(questionnaire: Questionnaire): string[] {
  const actions: string[] = [];
  const moderate = questionnaire.moderateMinutes || 0;
  const vigorous = questionnaire.vigorousMinutes || 0;
  const equivalentMinutes = moderate + vigorous * 2;
  const sportLabels: Partial<Record<SportType, string>> = {
    walking: "Continuez la marche rapide et augmentez progressivement la durée totale hebdomadaire.",
    running: "Conservez la course et ajoutez une séance facile si la récupération est bonne.",
    cycling: "Utilisez le vélo pour atteindre progressivement votre volume cardio hebdomadaire.",
    swimming: "Conservez la natation et complétez par du renforcement hors de l’eau.",
    strength: "Gardez la musculation et ajoutez du cardio modéré les jours sans renforcement.",
    yoga: "Conservez le yoga ou le Pilates et ajoutez une activité cardio régulière.",
    racket: "Conservez votre sport de raquette et complétez par une séance d’endurance facile.",
    team: "Conservez votre sport collectif et protégez au moins une journée de récupération.",
    fitness: "Conservez le fitness ou la danse et équilibrez cardio, force et mobilité."
  };
  if (questionnaire.sportType && sportLabels[questionnaire.sportType]) actions.push(sportLabels[questionnaire.sportType] as string);
  if (equivalentMinutes < 150) actions.push(`Ajoutez environ ${Math.max(30, 150 - equivalentMinutes)} minutes équivalentes d’activité cette semaine, par paliers de 10 à 15 minutes.`);
  else if (equivalentMinutes < 300) actions.push("Progressez vers 200 à 300 minutes équivalentes par semaine si cela reste confortable.");
  else actions.push("Maintenez votre volume actuel et concentrez-vous sur la régularité et la récupération.");
  if ((questionnaire.strengthSessions || 0) < 2) actions.push("Ajoutez 2 séances de renforcement complet par semaine, espacées d’au moins 48 heures.");
  if ((questionnaire.mobilitySessions || 0) < 2) actions.push("Ajoutez 2 courtes séances de mobilité de 10 à 15 minutes par semaine.");
  if (questionnaire.injuries === "light" || questionnaire.injuries === "frequent" || questionnaire.injuries === "limited") actions.push("Choisissez une progression sans douleur et faites évaluer toute limitation persistante avant d’augmenter la charge.");
  return actions.slice(0, 4);
}

function nutritionActions(questionnaire: Questionnaire): string[] {
  const actions: string[] = [];
  const fruitVeg = questionnaire.fruitVegServingsPerDay || 0;
  const legumes = questionnaire.legumesPerWeek || 0;
  const fish = questionnaire.fattyFishPerWeek || 0;
  const nuts = questionnaire.nutsSeedsPerWeek || 0;
  const sugary = questionnaire.sugaryDrinksPerWeek || 0;
  const processedMeat = questionnaire.processedMeatPerWeek || 0;
  if (fruitVeg < 5) actions.push(`Passez de ${fruitVeg} à 5 portions de fruits et légumes par jour en ajoutant une portion tous les 5 à 7 jours.`);
  if (legumes < 2) actions.push("Planifiez 2 à 3 portions de légumineuses par semaine, en remplacement d’une viande transformée ou d’un plat ultra-transformé.");
  if (fish < 1) actions.push("Ajoutez 1 à 2 portions de poisson gras par semaine, sauf contre-indication personnelle.");
  if (nuts < 5) actions.push("Ajoutez une petite poignée de noix ou graines non salées la plupart des jours.");
  if (sugary > 1) actions.push(`Réduisez les boissons sucrées de ${sugary} à 1 ou moins par semaine, en remplaçant d’abord une consommation sur deux.`);
  if (processedMeat > 1) actions.push(`Réduisez les viandes transformées de ${processedMeat} à 1 portion ou moins par semaine.`);
  if (questionnaire.ultraProcessed === "frequent" || questionnaire.ultraProcessed === "daily") actions.push("Remplacez chaque jour un produit ultra-transformé par un aliment peu transformé riche en fibres ou protéines.");
  if (questionnaire.wholeGrains === "rare") actions.push("Choisissez une version complète pour au moins un féculent quotidien.");
  return actions.slice(0, 4);
}

function personalizedActions(key: PriorityKey, profile: Profile, questionnaire: Questionnaire): string[] {
  if (key === "activity") return activityActions(questionnaire);
  if (key === "nutrition") return nutritionActions(questionnaire);
  if (key === "sedentary") {
    const sitting = questionnaire.sittingHours || 0;
    return [
      sitting > 0 ? `Réduisez progressivement votre temps assis de ${sitting} à moins de 7 à 8 heures par jour.` : "Mesurez d’abord votre temps assis moyen sur une semaine.",
      "Levez-vous ou marchez 2 à 5 minutes toutes les 30 à 60 minutes.",
      "Ajoutez une marche de 10 minutes après un ou deux repas chaque jour."
    ];
  }
  if (key === "sleep") {
    const sleep = questionnaire.sleepHours || 0;
    return [
      sleep > 0 ? `Allongez progressivement votre sommeil de ${sleep} h vers une plage de 7 à 9 h, par pas de 15 minutes.` : "Stabilisez d’abord une heure de coucher et de lever régulière.",
      "Exposez-vous à la lumière naturelle le matin et réduisez les écrans durant la dernière heure avant le coucher.",
      "Consultez en cas de ronflements importants, pauses respiratoires ou insomnie persistante."
    ];
  }
  if (key === "tobacco") return ["Fixez une date d’arrêt réaliste.", "Demandez un accompagnement médical ou pharmaceutique et discutez des substituts nicotiniques.", "Identifiez les trois situations qui déclenchent le plus souvent la consommation et préparez une alternative pour chacune."];
  if (key === "alcohol") return ["Réduisez progressivement le nombre de verres hebdomadaires.", "Prévoyez plusieurs jours sans alcool chaque semaine.", "Évitez de regrouper les consommations sur une seule soirée."];
  if (key === "stressRecovery") return ["Planifiez chaque jour 10 à 20 minutes de récupération sans écran.", "Protégez un horaire de sommeil régulier.", "Consultez si l’épuisement, l’anxiété ou la fatigue persistent."];
  if (key === "morphology") return ["Visez une évolution progressive plutôt qu’un objectif de poids rapide.", "Associez renforcement musculaire, activité d’endurance et alimentation riche en fibres.", profile.waistCm ? "Suivez le tour de taille une fois par mois, dans les mêmes conditions." : "Ajoutez un suivi mensuel du tour de taille."];
  return [];
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
      return { key, severity, estimateMinMonths, estimateMaxMonths, personalizedActions: personalizedActions(key, profile, questionnaire), ...metadata[key] };
    })
    .filter((item) => item.severity >= 12)
    .sort((a, b) => b.severity - a.severity)
    .slice(0, 3);
}
