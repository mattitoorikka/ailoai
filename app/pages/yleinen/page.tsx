"use client";

import React, { useState, useEffect } from "react";
import styles from "../shared/page.module.css";
import Chat from "../../components/chat";
import FileViewer from "../../components/file-viewer";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import { useAssistantId } from "@/app/hooks/useAssistantId";
import Link from "next/link";

const YleinenPage = () => {
  const topic = "yleinen";
  const assistantId = useAssistantId(topic);

  const [isMobile, setIsMobile] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [isFileViewerOpen, setFileViewerOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setIsPanelVisible(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const togglePanel = () => {
    setIsPanelVisible((prev) => !prev);
  };

  const functionCallHandler = async (call: RequiredActionFunctionToolCall) => {
    try {
      const args = JSON.parse(call.function.arguments || "{}");

      return JSON.stringify({ error: `Unsupported function: ${call.function.name}` });
    } catch (err) {
      console.error("Function call error:", err);
      return JSON.stringify({ error: (err as Error).message });
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Vasen paneeli */}
        {(!isMobile || isPanelVisible) && (
          <div className={`${styles.column} ${isMobile && isPanelVisible ? styles.fullScreenPanel : ""}`}>
            <div className={styles.instructions}>
              <div className={styles.headerContent}>
                <h2>Solmio Ailo™ – Yleinen avustaja</h2>
                <p>
                Autan sinua arjen tilanteissa: ohjeissa, viestinnässä ja ongelmatilanteissa 💬
                </p>
              </div>

              <ul>
                <li>
                  <span>📋</span>
                  <div>
                    <strong>Henkilöstöviestintä:</strong>
                    <p>Laadin viikkoinfot, muistutukset ja selkeät tiedotteet henkilöstölle.</p>
                  </div>
                </li>
                <li>
                  <span>💬</span>
                  <div>
                    <strong>Asiakastilanteet:</strong>
                    <p>Autan kirjoittamaan vastauksia palautteisiin ja viestejä asiakkaille – selkeästi ja kohteliaasti.</p>
                  </div>
                </li>
                <li>
                  <span>🛠️</span>
                  <div>
                    <strong>Viranomaistiedotteet ja raportointi:</strong>
                    <p>Autan anniskeluluvissa, tapahtumien suunnittelussa, puolivuotis-ilmoituksissa ja monessa muussa.</p>
                  </div>
                </li>
                <li>
                  <span>💡</span>
                  <div>
                    <strong>Kuvien analysointi:</strong>
                    <p>Voit ladata minulle kuvan vaikkapa ravintolasalista, salaattipöydästä tai varastosta ja osaan kertoa onko se ohjeistuksen mukainen.</p>
                  </div>
                </li>
              </ul>

              <div className={styles.fileViewerBottomArea}>
                <div className={styles.buttonRow}>
                  <Link href="/pages/yleinen" className={styles.actionButton}>
                    🧹 Uusi keskustelu
                  </Link>
                  <Link href="/" className={styles.actionButton}>
                    🔙 Etusivulle
                  </Link>
                  <li>
                  <span>💡</span>
                  <div>
                    <strong>Ailo räätälöitynä</strong>
                    <p>Haluatko Ailon räätälöitynä juuri sinun yrityksellesi? Ota yhteyttä myynti@solmiokassa.fi</p>
                  </div>
                </li>
                </div>

                <div className={styles.fileToggleWrapper}>
                  <button
                    className={styles.fileToggleButton}
                    onClick={() => setFileViewerOpen(!isFileViewerOpen)}
                  >
                    {isFileViewerOpen ? "❌ Sulje tiedostonäkymä" : "📂 Näytä tiedostonäkymä"}
                  </button>
                </div>

                {isFileViewerOpen && assistantId && (
                  <div className={styles.fileViewer}>
                    <FileViewer topic="yleinen" />
                  </div>
                )}
              </div>
            </div>

            {isMobile && isPanelVisible && (
              <button className={styles.closePanelButton} onClick={togglePanel}>
                ❌
              </button>
            )}
          </div>
        )}

        {/* Chat-paneeli */}
        <div className={`${styles.chatContainer} ${isMobile && !isPanelVisible ? styles.fullScreenChat : ""}`}>
          {isMobile && !isPanelVisible && (
            <button className={styles.openPanelButton} onClick={togglePanel} aria-label="Näytä ohjeet">
              ❔
            </button>
          )}
          <div className={styles.chat}>
            {assistantId && (
              <Chat functionCallHandler={functionCallHandler} topic={topic} assistantId={assistantId} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default YleinenPage;
