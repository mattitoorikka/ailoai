// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";
import defaultStrings from "@/app/lib/defaultStrings"; 

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? (localStorage.getItem("theme") as "light" | "dark" | null)
        : null;
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initial = stored ?? (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  };

  return (
    <button
      onClick={toggle}
      title={theme === "light" ? "Vaihda tummaan tilaan" : "Vaihda vaaleaan tilaan"}
      style={{
        padding: "6px 10px",
        borderRadius: "8px",
        backgroundColor: "var(--panel)",
        color: "var(--ink)",
        border: "1px solid var(--border)",
        cursor: "pointer",
        fontSize: "0.85rem",
      }}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}

export default function Home() {
  const router = useRouter();

  const s = defaultStrings;

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div>
          <Image src={s.logoUrl} alt="Solmio logo" width={200} height={68} priority />
        </div>

        <div className={styles.title}>{s.heroTitle}</div>
      </div>

      <p className={styles.intro}>{s.heroIntro}</p>

      <h2 className={styles.sectionTitle}>
        Klikkaa sinua kiinnostavaa aihealuetta ja hyppää mukaan Ailo-maailmaan. Kysy mitä haluat.
      </h2>

      <div className={styles.cardGrid}>
        {s.topics.map((topic) => (
          <button
            key={topic.title}
            onClick={() => router.push(topic.path)}
            className={styles.card}
          >
            <div className={styles.cardTitle}>{topic.title}</div>
            <div className={styles.cardText}>{topic.subtitle}</div>
          </button>
        ))}
      </div>

      <h2 className={styles.downloadTitle}>📥 Ladattavat pohjat</h2>
      <ul className={styles.downloadList}>
        <li>
          <a href={s.downloads.basicInfoHref}>{s.downloads.basicInfoLabel}</a> – Syötä ravintolasi perustiedot
        </li>
        <li>
          <a href={s.downloads.calendarHref}>{s.downloads.calendarLabel}</a> – suunnittele julkaisut viikoksi tai kuukaudeksi.
        </li>
      </ul>

      <p className={styles.note}>{s.tagline}</p>
    </main>
  );
}
