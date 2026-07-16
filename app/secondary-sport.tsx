"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./secondary-sport.module.css";

type Language = "fr" | "en";
type SportType = "none" | "walking" | "running" | "cycling" | "swimming" | "racket" | "team" | "strength" | "fitness" | "yoga" | "other";

const STORAGE_KEY = "biological-age-secondary-sport-v1";

const content: Record<Language, {
  label: string;
  hint: string;
  source: string;
  options: Array<{ value: SportType; label: string }>;
}> = {
  fr: {
    label: "Second sport (optionnel)",
    hint: "Les minutes modérées et intenses doivent cumuler toutes vos activités. Déclarer un second sport ne double pas le score à lui seul.",
    source: "Repère OMS",
    options: [
      { value: "none", label: "Aucun second sport" },
      { value: "walking", label: "Marche rapide ou randonnée" },
      { value: "running", label: "Course à pied" },
      { value: "cycling", label: "Vélo" },
      { value: "swimming", label: "Natation" },
      { value: "racket", label: "Sport de raquette" },
      { value: "team", label: "Sport collectif" },
      { value: "strength", label: "Musculation" },
      { value: "fitness", label: "Fitness ou danse" },
      { value: "yoga", label: "Yoga, pilates ou mobilité" },
      { value: "other", label: "Autre" }
    ]
  },
  en: {
    label: "Second sport (optional)",
    hint: "Moderate and vigorous minutes should include all your activities. Reporting a second sport does not double the score by itself.",
    source: "WHO reference",
    options: [
      { value: "none", label: "No second sport" },
      { value: "walking", label: "Brisk walking or hiking" },
      { value: "running", label: "Running" },
      { value: "cycling", label: "Cycling" },
      { value: "swimming", label: "Swimming" },
      { value: "racket", label: "Racket sport" },
      { value: "team", label: "Team sport" },
      { value: "strength", label: "Strength training" },
      { value: "fitness", label: "Fitness or dance" },
      { value: "yoga", label: "Yoga, pilates or mobility" },
      { value: "other", label: "Other" }
    ]
  }
};

function isSportType(value: string | null): value is SportType {
  return ["none", "walking", "running", "cycling", "swimming", "racket", "team", "strength", "fitness", "yoga", "other"].includes(value || "");
}

function findMovementGrid() {
  const fieldsets = document.querySelectorAll<HTMLFieldSetElement>(".assessmentForm fieldset");
  return fieldsets[1]?.querySelector<HTMLElement>(".formGrid") || null;
}

export function SecondarySport() {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [language, setLanguage] = useState<Language>("fr");
  const [value, setValue] = useState<SportType>("none");

  useEffect(() => {
    const updateTarget = () => setTarget(findMovementGrid());
    const frame = window.requestAnimationFrame(updateTarget);
    const observer = new MutationObserver(updateTarget);
    observer.observe(document.body, { childList: true, subtree: true });

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isSportType(stored)) setValue(stored);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const updateLanguage = () => setLanguage(document.documentElement.lang === "en" ? "en" : "fr");
    updateLanguage();
    const observer = new MutationObserver(updateLanguage);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleReset = (event: MouseEvent) => {
      const element = event.target instanceof Element ? event.target : null;
      if (!element?.closest("button.secondary")) return;
      setValue("none");
      window.localStorage.removeItem(STORAGE_KEY);
    };
    document.addEventListener("click", handleReset);
    return () => document.removeEventListener("click", handleReset);
  }, []);

  if (!target) return null;
  const translated = content[language];

  return createPortal(
    <label className={`field ${styles.field}`} data-secondary-sport="true">
      <span>{translated.label}</span>
      <select
        value={value}
        onChange={(event) => {
          const next = event.currentTarget.value as SportType;
          setValue(next);
          window.localStorage.setItem(STORAGE_KEY, next);
        }}
      >
        {translated.options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <small className={styles.hint}>
        {translated.hint}{" "}
        <a href="https://www.who.int/news-room/fact-sheets/detail/physical-activity" target="_blank" rel="noreferrer noopener">
          {translated.source}
        </a>
      </small>
    </label>,
    target
  );
}
