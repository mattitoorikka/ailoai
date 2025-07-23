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
  
        if (call.function.name === "get_sales_data") {
          const { start_date, end_date } = args;
          if (!start_date || !end_date) throw new Error("Start and end dates required.");
          const url = `/api/salesdata/?start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}&use_dynamic_group_connections=false`;
          const res = await fetch(url, { credentials: "include" });
          if (!res.ok) throw new Error(`Sales data error: ${res.statusText}`);
          return await res.json();
        }
  
        if (call.function.name === "fetch_inventory_status") {
          const date = args.date || new Date().toISOString().split("T")[0] + "T06:00:00+02";
          const res = await fetch(`/api/inventory-status?date=${encodeURIComponent(date)}`, { credentials: "include" });
          if (!res.ok) throw new Error(`Inventory error: ${res.statusText}`);
          return JSON.stringify(await res.json());
        }
  
        if (call.function.name === "fetch_historical_weather_data") {
          const { city, date } = args;
          if (!city || !date) throw new Error("City and Date required.");
          const res = await fetch(`/api/weather-data?city=${encodeURIComponent(city)}&date=${encodeURIComponent(date)}`, { credentials: "include" });
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(`Weather error: ${errorData.error}`);
          }
          return JSON.stringify(await res.json());
        }
  
        if (call.function.name === "get_recipes") {
          const query = args.query || "lohi";
          const number = args.number || 3;
          const res = await fetch(`/api/spoonacular-recipes?query=${encodeURIComponent(query)}&number=${number}`, {
            credentials: "include",
          });
          if (!res.ok) throw new Error(`Recipe fetch error: ${res.statusText}`);
          return JSON.stringify(await res.json());
        }
        
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
                <li>
                  <span>💡</span>
                  <div>
                    <strong>Ailo räätälöitynä</strong>
                    <p>Haluatko Ailon räätälöitynä juuri sinun yrityksellesi? Ota yhteyttä myynti@solmiokassa.fi</p>
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
