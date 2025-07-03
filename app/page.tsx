// app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <main
      style={{
        fontFamily: "sans-serif",
        backgroundColor: "#ffffff",
        padding: "2rem",
        color: "#283332",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2.5rem",
        }}
      >

        <div style={{ flex: "0 0 auto" }}>
          <Image
            src="/logo-solmio-vaaka-oranssi.png"
            alt="Solmio logo"
            width={200}
            height={68}
          />
        </div>

        {/* Otsikko keskelle */}
        <div style={{ flex: "1", textAlign: "center", marginRight: "200px" }}>
          <h1 style={{ fontSize: "2.7rem", fontWeight: "bold", margin: 0 }}>
            Solmio Ailo
            <span style={{ fontSize: "1rem", verticalAlign: "super" }}>TM</span>
          </h1>
        </div>
      </div>



      <p
        style={{
          fontSize: "1.3rem",
          marginBottom: "2.5rem",
          textAlign: "left",
          maxWidth: "800px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Tervetuloa Ailoon – tekoälytyökaveri, joka tuo tehokkuutta ravintolasi arkeen.
        Ailo auttaa sinua kampanjoiden ideoinnissa, ruokalistan suunnittelussa ja yleisissä asioissa –
        nopeasti, helposti ja datalla pohjaten. Voit myös ladata mukaan oman ravintolasi tiedostoja ja saat juuri sinulle räätälöityä apua.
      </p>

      {/* Aihealueiden otsikko */}
      <h2
        style={{
          fontSize: "1.6rem",
          marginBottom: "1.5rem",
          textAlign: "center",
          color: "#283332",
        }}
      >
        Klikkaa sinua kiinnostavaa aihealuetta ja hyppää mukaan Ailo-maailmaan.
      </h2>

      {/* Aihekortit */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          justifyContent: "space-between",
          marginBottom: "3rem",
        }}
      >
        {[
          {
            title: "📣 Markkinointi ja viestintä asiakkaille",
            subtitle:
              "Tee ravintolastasi näkyvä! Ailo ideoi kampanjat, somepostaukset ja henkilöstötiedotteet puolestasi – nopeasti ja brändisi näköisesti.  Tai auttaa vaikka vastaamaan hankalaan asiakaspalautteeseen.",
            path: "/pages/markkinointi",
          },
          {
            title: "🥗 Valikoimasuunnittelu",
            subtitle:
              "Luo myyvä ruokalista, joka toimii juuri teidän ravintolassanne. Ailo rakentaa valikoimia, jotka houkuttelevat asiakkaita, ottaa huomioon käytettävissä olevan laitteiston sekä henkilöstöresurssit. Lisää myyntiä ja suunnittele varmasti toimiva valikoima.",
            path: "/pages/valikoima",
          },
          {
            title: "📝 HR",
            subtitle:
              "Avustan työvuorosuunnittelussa, tunnen TES:sin ja lainsäädännön ja osaan ehdottaa muutoksia äkillisissä tarpeissa.",
            path: "/pages/hr",
          },
          {
            title: "📝 Tarjouspyynnöt",
            subtitle:
              "Luo tarjouksia eri asiakasryhmille, kuten yrityksille, yksityistilaisuuksiin tai tapahtumiin. Ailo auttaa sinua räätälöimään tarjoukset asiakkaan tarpeiden mukaan. Osaan ehdottaa myös lisämyyntiä ja kampanjoita.",
            path: "/pages/tarjoukset",
          },
          {
            title: "📝 Tukipalvelut, ongelmanratkaisu ja sisäinen viestintä",
            subtitle:
              "Helpota arkea! Ailo auttaa tilanteissa, jossa kassa ei toimi, kylmiö on lämmin tai terveystarkastaja tarvitsee tietoja – selkeästi ja helposti. Osaan avustaa myös perehdytyksessä tai vaikkapa pisteen avauksessa tuuraajalle.",
            path: "/pages/yleinen",
          },
        ].map((topic) => (
          <button
            key={topic.title}
            onClick={() => router.push(topic.path)}
            style={{
              flex: "1 1 30%",
              minWidth: "320px",
              padding: "2rem",
              backgroundColor: "#f89420",
              color: "#283332",
              fontWeight: "bold",
              border: "2px solid #283332",
              borderRadius: "16px",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "1.4rem",
              lineHeight: "1.6",
              transition: "background-color 0.2s ease",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#fbcf94";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#fddfb0";
            }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
              {topic.title}
            </div>
            <div
              style={{
                fontSize: "1.05rem",
                fontWeight: "normal",
                color: "#333",
              }}
            >
              {topic.subtitle}
            </div>
          </button>
        ))}
      </div>

      {/* Ladattavat materiaalit */}
      <h2 style={{ fontSize: "1.0rem", marginBottom: "1rem" }}>📥 Ladattavat pohjat</h2>
      <ul
        style={{
          paddingLeft: "1rem",
          fontSize: "0.9rem",
          lineHeight: "1.8",
          marginBottom: "2rem",
        }}
      >
        <li>
          <a href="/downloads/ravintolan_perustieto.docx" style={{ color: "#f89420" }}>
            Perustietolomake
          </a>{" "}
          – Syötä ravintolasi perustiedot
        </li>
        <li>
          <a href="/downloads/somekalenteripohja.docx" style={{ color: "#f89420" }}>
            Somekalenterin runko
          </a>{" "}
          – suunnittele julkaisut viikoksi tai kuukaudeksi.
        </li>
      </ul>

      <p
        style={{
          fontStyle: "italic",
          fontSize: "1rem",
          color: "#666",
          maxWidth: "700px",
        }}
      >
        Kehitämme Ailoa jatkuvasti – anna palautetta ja kokeile eri aiheita rohkeasti.
      </p>
    </main>
  );
}
