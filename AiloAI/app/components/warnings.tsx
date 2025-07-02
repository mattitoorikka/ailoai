"use client";

import React, { useState } from "react";
import styles from "./warnings.module.css";

// Määrittele komponentin props-tyyppi
type WarningsProps = {
  assistantId?: string; // Tehdään valinnaiseksi, jolloin komponentti toimii joustavammin
};

const Warnings = ({ assistantId }: WarningsProps) => {
  const [loading, setLoading] = useState(false);
  const [newAssistantId, setNewAssistantId] = useState("");

  const fetchAssistantId = async () => {
    setLoading(true);

    const response = await fetch("/api/assistants", { method: "POST" });
    const data = await response.json();
    setNewAssistantId(data.assistantId);

    setLoading(false);
  };

  // Jos assistantId on jo olemassa, ei näytetä varoitusta
  if (assistantId) return null;

  return (
    <div className={styles.container}>
      <h1>Start by creating your assistant</h1>
      <div className={styles.message}>
        Create an assistant and set its ID in your Auth0 user metadata
      </div>
      {!newAssistantId ? (
        <button
          onClick={fetchAssistantId}
          disabled={loading}
          className={styles.button}
        >
          {loading ? "Loading..." : "Create Assistant"}
        </button>
      ) : (
        <div className={styles.result}>{newAssistantId}</div>
      )}
    </div>
  );
};

export default Warnings;
