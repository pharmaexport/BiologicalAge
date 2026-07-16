"use client";

import { useEffect } from "react";
import styles from "./evidence-notes.module.css";

type Language = "fr" | "en";
type Section = "profile" | "movement" | "recovery" | "nutrition" | "habits" | "vitals" | "method";

type EvidenceContent = {
  text: string;
  sourceLabel: string;
  sources: Array<{ label: string; href: string }>;
};

const evidence: Record<Language, Record<Section, EvidenceContent>> = {
  fr: {
    profile: {
      text: "L’IMC est utilisé comme repère de dépistage et le tour de taille apporte une information complémentaire ; aucun de ces indicateurs ne résume, à lui seul, l’état de santé individuel.",
      sourceLabel: "Repère officiel",
      sources: [
        {
          label: "OMS — surpoids, obésité, IMC et tour de taille",
          href: "https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
        }
      ]
    },
    movement: {
      text: "Chez l’adulte, le repère de base est d’au moins 150 minutes d’activité modérée par semaine ; toute activité compte, le renforcement est bénéfique et le temps sédentaire doit être limité.",
      sourceLabel: "Repère officiel",
      sources: [
        {
          label: "OMS — activité physique et sédentarité",
          href: "https://www.who.int/news-room/fact-sheets/detail/physical-activity"
        }
      ]
    },
    recovery: {
      text: "Le sommeil est apprécié par sa durée et sa qualité ; le stress et la fatigue sont auto-déclarés et ne constituent pas des scores diagnostiques.",
      sourceLabel: "Repères officiels",
      sources: [
        { label: "CDC — durée et qualité du sommeil", href: "https://www.cdc.gov/sleep/about/index.html" },
        { label: "OMS — stress", href: "https://www.who.int/news-room/questions-and-answers/item/stress" }
      ]
    },
    nutrition: {
      text: "Le bloc valorise les aliments peu transformés, les fruits et légumes, les légumineuses, les céréales complètes et les noix, tout en limitant sucres libres, sel, graisses défavorables et produits très transformés.",
      sourceLabel: "Repère officiel",
      sources: [
        { label: "OMS — alimentation saine", href: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet" }
      ]
    },
    habits: {
      text: "Toutes les formes de tabac sont nocives et la nicotine crée une dépendance. Pour l’alcool, le repère français de moindre risque est au maximum 10 verres par semaine, 2 par jour et des jours sans consommation ; il n’équivaut pas à une absence de risque.",
      sourceLabel: "Repères officiels",
      sources: [
        { label: "OMS — tabac et nicotine", href: "https://www.who.int/news-room/fact-sheets/detail/tobacco" },
        { label: "Santé publique France — Alcool Info Service", href: "https://www.alcool-info-service.fr/" }
      ]
    },
    vitals: {
      text: "La tension et le pouls sont optionnels : une valeur isolée ne suffit pas à poser un diagnostic et doit être confirmée puis interprétée selon le contexte clinique.",
      sourceLabel: "Repères officiels",
      sources: [
        {
          label: "Assurance Maladie — hypertension artérielle",
          href: "https://www.ameli.fr/assure/sante/themes/hypertension-arterielle-hta/definition-facteurs-favorisants"
        },
        { label: "NIH MedlinePlus — pouls au repos", href: "https://medlineplus.gov/ency/article/003399.htm" }
      ]
    },
    method: {
      text: "Les références institutionnelles justifient les domaines et les repères affichés. Les pondérations, les seuils intermédiaires et la conversion du score en « âge biologique » sont un modèle interne éducatif, non un biomarqueur validé cliniquement.",
      sourceLabel: "Traçabilité",
      sources: [
        {
          label: "Consulter la méthodologie complète",
          href: "https://github.com/pharmaexport/BiologicalAge/blob/main/METHODOLOGY.md"
        }
      ]
    }
  },
  en: {
    profile: {
      text: "BMI is used as a screening reference and waist circumference adds complementary information; neither indicator alone summarizes an individual’s health status.",
      sourceLabel: "Official reference",
      sources: [
        {
          label: "WHO — overweight, obesity, BMI and waist circumference",
          href: "https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
        }
      ]
    },
    movement: {
      text: "For adults, the baseline reference is at least 150 minutes of moderate activity per week; all activity counts, strengthening is beneficial and sedentary time should be limited.",
      sourceLabel: "Official reference",
      sources: [
        {
          label: "WHO — physical activity and sedentary behaviour",
          href: "https://www.who.int/news-room/fact-sheets/detail/physical-activity"
        }
      ]
    },
    recovery: {
      text: "Sleep is assessed through duration and quality; stress and fatigue are self-reported and are not diagnostic scores.",
      sourceLabel: "Official references",
      sources: [
        { label: "CDC — sleep duration and quality", href: "https://www.cdc.gov/sleep/about/index.html" },
        { label: "WHO — stress", href: "https://www.who.int/news-room/questions-and-answers/item/stress" }
      ]
    },
    nutrition: {
      text: "This section favours minimally processed foods, fruit and vegetables, pulses, whole grains and nuts, while limiting free sugars, salt, unfavourable fats and highly processed foods.",
      sourceLabel: "Official reference",
      sources: [
        { label: "WHO — healthy diet", href: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet" }
      ]
    },
    habits: {
      text: "All forms of tobacco are harmful and nicotine is addictive. The French lower-risk alcohol reference is no more than 10 drinks per week, 2 per day, with alcohol-free days; this does not mean risk-free consumption.",
      sourceLabel: "Official references",
      sources: [
        { label: "WHO — tobacco and nicotine", href: "https://www.who.int/news-room/fact-sheets/detail/tobacco" },
        { label: "Santé publique France — Alcool Info Service", href: "https://www.alcool-info-service.fr/" }
      ]
    },
    vitals: {
      text: "Blood pressure and pulse are optional: one isolated value is not diagnostic and should be confirmed and interpreted in its clinical context.",
      sourceLabel: "Official references",
      sources: [
        {
          label: "French National Health Insurance — hypertension",
          href: "https://www.ameli.fr/assure/sante/themes/hypertension-arterielle-hta/definition-facteurs-favorisants"
        },
        { label: "NIH MedlinePlus — resting pulse", href: "https://medlineplus.gov/ency/article/003399.htm" }
      ]
    },
    method: {
      text: "Institutional references support the domains and displayed benchmarks. Weightings, intermediate thresholds and score-to-age conversion are an internal educational model, not a clinically validated biomarker.",
      sourceLabel: "Traceability",
      sources: [
        {
          label: "Read the complete methodology",
          href: "https://github.com/pharmaexport/BiologicalAge/blob/main/METHODOLOGY.md"
        }
      ]
    }
  }
};

function makeNote(section: Section, language: Language) {
  const content = evidence[language][section];
  const note = document.createElement("div");
  note.className = `${styles.note}${section === "method" ? ` ${styles.methodNote}` : ""}`;
  note.dataset.evidenceNote = section;

  const explanation = document.createElement("p");
  explanation.textContent = content.text;
  note.appendChild(explanation);

  const sources = document.createElement("p");
  sources.className = styles.sources;
  const heading = document.createElement("strong");
  heading.textContent = `${content.sourceLabel} : `;
  sources.appendChild(heading);

  content.sources.forEach((source, index) => {
    if (index > 0) sources.appendChild(document.createTextNode(" · "));
    const link = document.createElement("a");
    link.href = source.href;
    link.target = "_blank";
    link.rel = "noreferrer noopener";
    link.textContent = source.label;
    sources.appendChild(link);
  });

  note.appendChild(sources);
  return note;
}

function removeNotes() {
  document.querySelectorAll<HTMLElement>("[data-evidence-note]").forEach((note) => note.remove());
}

function insertNotes() {
  removeNotes();
  const language: Language = document.documentElement.lang === "en" ? "en" : "fr";
  const sections: Section[] = ["profile", "movement", "recovery", "nutrition", "habits", "vitals"];
  const fieldsets = document.querySelectorAll<HTMLFieldSetElement>(".assessmentForm fieldset");

  sections.forEach((section, index) => {
    const fieldset = fieldsets[index];
    if (!fieldset) return;
    const anchor = fieldset.querySelector(":scope > p") || fieldset.querySelector("legend");
    anchor?.insertAdjacentElement("afterend", makeNote(section, language));
  });

  const methodCard = document.querySelector<HTMLElement>(".methodCard");
  methodCard?.appendChild(makeNote("method", language));
}

export function EvidenceNotes() {
  useEffect(() => {
    const frame = window.requestAnimationFrame(insertNotes);
    const observer = new MutationObserver(() => insertNotes());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      removeNotes();
    };
  }, []);

  return null;
}
